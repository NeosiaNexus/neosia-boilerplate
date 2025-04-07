'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import supabase from '@/lib/supabase';
import { storageFileSchema } from '@/schemas';

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  deletedFiles: z.array(storageFileSchema).nullable(),
});

const paramSchema = z.object({
  bucket: z.string(),
  paths: z.array(z.string()),
});

const removeFilesAction = authAction
  .outputSchema(outputSchema)
  .schema(paramSchema)
  .action(async ({ parsedInput: { bucket, paths } }) => {
    if (paths.length === 0) {
      return {
        message: 'Aucun fichier à supprimer',
        success: false,
        deletedFiles: null,
      };
    }

    const { error, data } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      return {
        message:
          paths.length === 1
            ? 'Une erreur est survenue lors de la suppression du fichier'
            : 'Une erreur est survenue lors de la suppression des fichiers',
        success: false,
        deletedFiles: null,
      };
    }

    const message =
      paths.length === 1
        ? 'Le fichier a été supprimé avec succès'
        : 'Les fichiers ont été supprimés avec succès';

    return {
      message,
      success: true,
      deletedFiles: data,
    };
  });

export default removeFilesAction;
