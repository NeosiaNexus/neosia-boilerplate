'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import { getPresignedUrl, listObjectKeys } from '@/lib/storage';
import storageFileSchema from '@/schemas/file-storage-schema';

const paramSchema = z.object({
  bucket: z.string().min(1),
});

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(storageFileSchema),
});

export const listFilesAction = authAction
  .schema(paramSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { bucket } }) => {
    try {
      const allKeys: string[] = await listObjectKeys(bucket);

      const data = await Promise.all(
        allKeys.map(async key => {
          let presignedUrl: string;
          try {
            presignedUrl = await getPresignedUrl(bucket, key);
          } catch {
            presignedUrl = '';
          }

          return {
            path: key,
            publicUrl: presignedUrl,
          };
        }),
      );

      return {
        message: 'Les fichiers ont été récupérés avec succès',
        success: true,
        data,
      };
    } catch {
      return {
        message: 'Une erreur est survenue lors de la récupération des fichiers',
        success: false,
        data: [],
      };
    }
  });

export default listFilesAction;
