import signingClient from './signingClient';
import storage from './storage';

export async function getBucketOrCreate(bucketName: string, isPublic = false): Promise<void> {
  const exists = await storage.bucketExists(bucketName);
  if (!exists) {
    await storage.makeBucket(bucketName, process.env.MINIO_REGION);

    if (isPublic) {
      await storage.setBucketPolicy(bucketName, getPublicReadPolicy(bucketName));
    }
  }
}

function getPublicReadPolicy(bucketName: string): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  });
}

export async function getPresignedUrl(
  bucket: string,
  objectKey: string,
  expiresSeconds?: number,
): Promise<string> {
  return signingClient.presignedGetObject(bucket, objectKey, expiresSeconds);
}

export async function bucketExist(bucketName: string): Promise<boolean> {
  return storage.bucketExists(bucketName);
}

export async function listObjectKeys(bucket: string, prefix = ''): Promise<string[]> {
  const objects: string[] = [];
  const stream = storage.listObjectsV2(bucket, prefix, true);

  return new Promise((resolve, reject) => {
    stream.on('data', obj => {
      if (typeof obj.name === 'string') {
        objects.push(obj.name);
      }
    });
    stream.on('error', reject);
    stream.on('end', () => resolve(objects));
  });
}
