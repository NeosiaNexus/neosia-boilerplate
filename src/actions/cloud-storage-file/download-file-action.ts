'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import prisma from '@/lib/prisma';
import { bucketExist, getPresignedUrl } from '@/lib/storage';
import { pathSchema } from '@/schemas/common-schema';

const paramSchema = z.object({
  bucket: z.string(),
  path: pathSchema,
});

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  url: z.string().url().nullable(),
});

const downloadFileAction = authAction
  .schema(paramSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { bucket, path } }) => {
    if (!(await bucketExist(bucket))) {
      return {
        message: 'Le bucket n’existe pas',
        success: false,
        url: null,
      };
    }

    let url: string;
    try {
      url = await getPresignedUrl(bucket, path);
    } catch {
      return {
        message: 'Impossible de générer l’URL de téléchargement',
        success: false,
        url: null,
      };
    }

    try {
      await prisma.storageFile.update({
        where: { path },
        data: { totalDownloads: { increment: 1 } },
      });
    } catch {
      return {
        message: 'Erreur lors de la mise à jour du compteur',
        success: false,
        url: null,
      };
    }

    return {
      message: 'Fichier téléchargé avec succès',
      success: true,
      url,
    };
  });

export default downloadFileAction;
