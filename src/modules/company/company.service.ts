import type { Prisma } from '@prisma/client';
import type { FastifyRequest } from 'fastify';

import { z } from 'zod';
import config from '@/config';

import prisma from '@/services/prisma';
import minioClient, { Bucket } from '@/services/minio';
import { sendExternalRequestMail } from '@/services/mail/mail';

import { NotFoundError } from '@/error/NotFound';
import { BadRequestError } from '@/error/BadRequest';

import { zodId } from '@/utils/zod';
import paginate from '@/utils/paginate';
import generateCode from '@/utils/generateCode';
import { like, likeNullable } from '@/utils/prisma-filter';

import {
  CompanyQuerySchema,
  CreateCompanySchema,
  CreateCompanyContractSchema,
} from './company.schema';

export const getCompanies = async (req: FastifyRequest) => {
  const query = CompanyQuerySchema.parse(req.query);

  const where: Prisma.CompanyWhereInput = {};
  let orderBy: Prisma.CompanyOrderByWithRelationInput = { id: 'desc' };

  if (query.filters) {
    const { id, name, address, email, sector, location, description } = query.filters;

    if (id !== undefined) {
      where.id = id;
    }

    if (name !== undefined) {
      where.name = like(name);
    }

    if (email !== undefined) {
      where.email = likeNullable(email);
    }

    if (address !== undefined) {
      where.address = likeNullable(address);
    }

    if (location !== undefined) {
      where.location = likeNullable(location);
    }

    if (description !== undefined) {
      where.description = likeNullable(description);
    }

    if (sector !== undefined) {
      where.sector = like(sector);
    }
  }

  if (query.sorting) {
    const { id, desc } = query.sorting;
    orderBy = {
      [id]: desc ? 'desc' : 'asc',
    };
  }

  const [total, companies] = await Promise.all([
    prisma.company.count({ where }),
    prisma.company.findMany({
      take: query.limit,
      skip: query.page * query.limit,
      where,
      orderBy,
      include: { contracts: true },
    }),
  ]);

  return paginate(companies, query, total);
};

export const createCompany = async (req: FastifyRequest) => {
  const parsedBody = CreateCompanySchema.parse(req.body);

  const resp = await prisma.company.create({
    data: parsedBody,
    include: { contracts: true },
  });

  return resp;
};

export const updateCompany = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);
  const parsedBody = CreateCompanySchema.partial().parse(req.body);

  const company = await prisma.company.findUnique({ where: { id } });

  if (!company) {
    throw new NotFoundError('Firma bulunamadı');
  }

  const resp = await prisma.company.update({
    where: { id: company.id },
    data: parsedBody,
    include: { contracts: true },
  });

  return resp;
};

export const deleteCompany = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const company = await prisma.company.findUnique({ where: { id } });

  if (!company) {
    throw new NotFoundError('Firma bulunamdı');
  }

  await prisma.company.delete({ where: { id: company.id } });
};

export const createCompanyContract = async (req: FastifyRequest) => {
  console.log(req.params);
  const companyId = zodId.parse((req.params as any).id);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new NotFoundError('Firma bulunamadı');
  }

  let uri: string | undefined;
  const data: Record<string, any> = {};

  const allData = req.parts();

  for await (const part of allData) {
    if (part.type === 'file') {
      const fileName = part.filename;
      const extension = fileName?.substring(fileName.lastIndexOf('.'));
      uri = `${generateCode(24)}${extension}`;
      await minioClient.putObject(Bucket.Contract, uri, part.file, undefined, {
        'Content-Type': part.mimetype,
      });
    } else {
      data[part.fieldname] = part.value;
    }
  }

  if (!uri) {
    throw new BadRequestError('Geçersiz dosya');
  }

  const validate = CreateCompanyContractSchema.parse(data);

  await prisma.companyContract.create({
    data: {
      uri: `${Bucket.Contract}/${uri}`,
      ...validate,
      companyId: company.id,
    },
  });

  const resp = await prisma.company.findUnique({
    where: { id: company.id },
    include: { contracts: true },
  });

  return resp;
};

export const deleteCompanyContract = async (req: FastifyRequest) => {
  const id = zodId.parse((req.params as any).id);

  const contract = await prisma.companyContract.findUnique({
    where: { id },
  });

  if (!contract) {
    throw new NotFoundError('Sözleşme bulunamadı');
  }

  await Promise.all([
    minioClient.removeObject(Bucket.Contract, contract.uri.split('/')[1]),
    prisma.companyContract.delete({ where: { id: contract.id } }),
  ]);

  const resp = await prisma.company.findUnique({
    where: { id: contract.companyId },
    include: { contracts: true },
  });

  return resp;
};

export const sendRequestForm = async (req: FastifyRequest) => {
  const companyIds = z.coerce.number().array().parse(req.body);

  const companies = await prisma.company.findMany({
    where: { id: { in: companyIds }, email: { not: null } },
    select: { id: true, email: true },
  });

  const codes = companies.map((x) => ({
    code: generateCode(12),
    companyId: x.id,
    email: x.email!,
  }));

  await prisma.externalRequest.createMany({
    data: codes.map((x) => ({ code: x.code, companyId: x.companyId })),
  });

  for (let i = 0; i < codes.length; i++) {
    const company = codes[i];
    await sendExternalRequestMail({
      email: company.email!,
      url: `${config.app.domain}/forms/${company.code}`,
    });
  }
};
