import type { Prisma } from '@prisma/client';
import type { FastifyRequest } from 'fastify';

import prisma from '@/services/prisma';
import minioClient, { Bucket } from '@/services/minio';

import { NotFoundError } from '@/error/NotFound';

import paginate from '@/utils/paginate';
import generateCode from '@/utils/generateCode';
import { zodId, zodBaseString } from '@/utils/zod';
import { like, likeNullable } from '@/utils/prisma-filter';

import {
  CandidateQuerySchema,
  CandidateSearchQuery,
  CreateCandidateSchema,
} from './candidate.schema';

export const getCandidates = async (req: FastifyRequest) => {
  const query = CandidateQuerySchema.parse(req.query);

  const where: Prisma.CandidateWhereInput = {};

  if (query.filters) {
    const { filters } = query;

    if (filters.id) {
      where.id = filters.id;
    }

    if (filters.name) {
      where.name = like(filters.name);
    }

    if (filters.gender) {
      where.gender = filters.gender;
    }

    if (filters.militaryService?.length) {
      where.militaryService = {
        in: filters.militaryService,
      };
    }

    if (filters.email) {
      where.email = likeNullable(filters.email);
    }

    if (filters.phone) {
      where.phone = likeNullable(filters.phone);
    }

    if (filters.location) {
      where.location = likeNullable(filters.location);
    }

    if (filters.rate?.length) {
      if (filters.rate.length === 1) {
        where.rate = {
          gte: filters.rate[0],
        };
      } else {
        where.rate = {
          gte: filters.rate[0],
          lte: filters.rate[1],
        };
      }
    }
  }

  const [total, response] = await Promise.all([
    prisma.candidate.count({ where }),
    prisma.candidate.findMany({
      where,
      include: {
        positions: { select: { position: true } },
        references: true,
        languages: true,
        cvs: true,
        referrals: true,
      },
      take: query.limit,
      skip: query.page * query.limit,
    }),
  ]);

  return paginate(response, query, total);
};

export const searchCandidate = async (req: FastifyRequest) => {
  const query = CandidateSearchQuery.parse(req.query);

  if (query.name) {
    const candidates = await prisma.candidate.findMany({
      where: { name: like(query.name) },
      select: {
        id: true,
        name: true,
        referrals: true,
        positions: { select: { position: { select: { name: true } } } },
      },
      take: 30,
    });

    return candidates;
  }

  return [];
};

export const getCandidate = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      positions: { select: { position: true } },
      references: true,
      languages: true,
      cvs: true,
      referrals: true,
    },
  });

  if (!candidate) {
    throw new NotFoundError('Aday bulunamadı');
  }

  return candidate;
};

export const createCandidate = async (req: FastifyRequest) => {
  const data = CreateCandidateSchema.parse(req.body);

  await prisma.$transaction(async (tx) => {
    let ids: { positionId: number }[] = [];

    if (data.positions.length) {
      await tx.position.createMany({
        data: data.positions.map((x) => ({ name: x })),
        skipDuplicates: true,
      });

      const positions = await tx.position.findMany({
        select: { id: true },
        where: { name: { in: data.positions } },
      });

      ids = positions.map((x) => ({ positionId: x.id }));
    }

    await tx.candidate.create({
      data: {
        ...data,
        positions: { createMany: { data: ids } },
        languages: { createMany: { data: data.languages } },
        references: { createMany: { data: data.references } },
      },
    });
  });
};

export const deleteCandidateCv = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const cv = await prisma.candidateCv.findUnique({ where: { id } });

  if (!cv) {
    throw new NotFoundError('Cv bilgisi bulunamadı');
  }

  await prisma.candidateCv.delete({ where: { id: cv.id } });

  if (!cv.isExternal) {
    const fileName = cv.uri.substring(cv.uri.lastIndexOf('/'));
    await minioClient.removeObject(Bucket.Cv, fileName);
  }

  const response = await prisma.candidate.findUnique({
    where: { id: cv.candidateId },
    include: {
      positions: { select: { position: true } },
      references: true,
      languages: true,
      cvs: true,
      referrals: true,
    },
  });

  return response;
};

export const createCandidateCv = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const candidate = await prisma.candidate.findUnique({ where: { id } });

  if (!candidate) {
    throw new NotFoundError('Aday bulunamadı');
  }

  let uri: string | undefined;
  let externalUri: string | void | undefined;

  const allData = req.parts();

  for await (const part of allData) {
    if (part.type === 'file') {
      const fileName = part.filename;
      const extension = fileName?.substring(fileName.lastIndexOf('.'));
      uri = `${generateCode(24)}${extension}`;
      await minioClient.putObject(Bucket.Cv, uri, part.file, undefined, {
        'Content-Type': part.mimetype,
      });
    } else {
      if (part.fieldname) {
        externalUri = part.value as string;
      }
    }
  }

  if (!uri && !externalUri) {
    return;
  }

  const arr: Prisma.CandidateCvCreateManyInput[] = [];

  if (externalUri) {
    const isValidUrl = zodBaseString.trim().url('Geçerli değer girin').parse(externalUri);
    arr.push({
      candidateId: candidate.id,
      isExternal: true,
      uri: isValidUrl,
    });
  }

  if (uri) {
    arr.push({
      candidateId: candidate.id,
      isExternal: false,
      uri: `${Bucket.Cv}/${uri}`,
    });
  }

  await prisma.candidateCv.createMany({ data: arr });
  const response = await prisma.candidate.findUnique({
    where: { id: candidate.id },
    include: {
      positions: { select: { position: true } },
      references: true,
      languages: true,
      cvs: true,
      referrals: true,
    },
  });

  return response;
};

export const updateCandidate = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);
  const data = CreateCandidateSchema.partial().parse(req.body);

  const candidate = await prisma.candidate.findUnique({ where: { id } });

  if (!candidate) {
    throw new NotFoundError();
  }

  await prisma.$transaction(async (tx) => {
    const { positions, languages, references, ...other } = data;

    const promises = [
      (async () => {
        if (positions) {
          await tx.candidatePosition.deleteMany({ where: { candidateId: candidate.id } });

          if (positions.length) {
            await tx.position.createMany({
              data: positions.map((x) => ({ name: x })),
              skipDuplicates: true,
            });

            const findPositions = await tx.position.findMany({
              where: { name: { in: positions } },
              select: { id: true },
            });

            await tx.candidatePosition.createMany({
              data: findPositions.map((x) => ({ candidateId: candidate.id, positionId: x.id })),
              skipDuplicates: true,
            });
          }
        }
      })(),

      (async () => {
        if (languages) {
          await tx.candidateLanguage.deleteMany({ where: { candidateId: candidate.id } });

          if (languages.length) {
            await tx.candidateLanguage.createMany({
              data: languages.map((x) => ({ ...x, candidateId: candidate.id })),
            });
          }
        }
      })(),

      (async () => {
        if (references) {
          await tx.candidateReference.deleteMany({ where: { candidateId: candidate.id } });

          if (references.length) {
            await tx.candidateReference.createMany({
              data: references.map((x) => ({ ...x, candidateId: candidate.id })),
            });
          }
        }
      })(),

      tx.candidate.update({
        where: { id: candidate.id },
        data: other,
      }),
    ];

    await Promise.all(promises);
  });
};
