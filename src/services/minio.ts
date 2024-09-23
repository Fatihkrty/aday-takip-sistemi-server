import config from '@/config';
import { Client } from 'minio';

const minioClient = new Client({
  useSSL: false,
  port: config.minio.port,
  endPoint: config.minio.host,
  secretKey: config.minio.secretKey,
  accessKey: config.minio.accessKey,
});

export enum Bucket {
  Cv = 'candidate-cv',
  Contract = 'company-contract',
}

(async function initializeMinio() {
  const bucketList = Object.values(Bucket);

  for (let i = 0; i < bucketList.length; i++) {
    const bucketName = bucketList[i];
    if (!(await minioClient.bucketExists(bucketName))) {
      await minioClient.makeBucket(bucketName, 'tr-TR');
    }
  }
})();

export default minioClient;
