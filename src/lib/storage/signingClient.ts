import { Client as MinioClient } from 'minio';

const signingClient = new MinioClient({
  endPoint: process.env.MINIO_PUBLIC_HOST!,
  port: Number(process.env.MINIO_PORT!),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
  region: process.env.MINIO_REGION!,
});

export default signingClient;
