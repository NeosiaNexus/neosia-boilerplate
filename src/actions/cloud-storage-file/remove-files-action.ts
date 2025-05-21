'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import prisma from '@/lib/prisma';
import { storage } from '@/lib/storage';

const paramSchema = z.object({
  bucket: z.string().min(1),
  paths: z.array(z.string()).nonempty(),
});

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  deletedFiles: z.array(z.string()).nullable(),
});

export const removeFilesAction = authAction
  .schema(paramSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { bucket, paths } }) => {
    if (paths.length === 0) {
      return {
        message: 'Aucun fichier à supprimer',
        success: false,
        deletedFiles: null,
      };
    }

    const deleted: string[] = [];

    try {
      await Promise.all(
        paths.map(async key => {
          await storage.removeObject(bucket, key);
          deleted.push(key);
        }),
      );
    } catch {
      return {
        message:
          paths.length === 1
            ? 'Une erreur est survenue lors de la suppression du fichier'
            : 'Une erreur est survenue lors de la suppression des fichiers',
        success: false,
        deletedFiles: null,
      };
    }

    try {
      await prisma.storageFile.deleteMany({
        where: {
          bucket,
          path: { in: deleted },
        },
      });
    } catch {
      return {
        message: 'Une erreur est survenue lors de la suppression en base de données',
        success: false,
        deletedFiles: null,
      };
    }

    return {
      message:
        deleted.length === 1
          ? 'Le fichier a été supprimé avec succès'
          : 'Les fichiers ont été supprimés avec succès',
      success: true,
      deletedFiles: deleted,
    };
  });

export default removeFilesAction;
