import type { FastifyReply, FastifyRequest } from 'fastify';

import minioClient, { Bucket } from '@/services/minio';

import { UnprocessableError } from '@/error/Unprocessable';

export const getFileMinio = async (req: FastifyRequest, res: FastifyReply) => {
  const { bucket, fileId } = req.params as any;

  if (!bucket || !fileId) {
    throw new UnprocessableError('Geçersiz parametreler var');
  }

  if (!Object.values(Bucket).includes(bucket as any)) {
    throw new UnprocessableError('Hatalı dosya yolu');
  }

  const data = await minioClient.getObject(bucket, fileId);

  res.send(data);

  return res;
};
