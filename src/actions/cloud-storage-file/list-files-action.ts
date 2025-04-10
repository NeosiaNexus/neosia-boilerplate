'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import supabase from '@/lib/supabase';
import { storageFileSchema } from '@/schemas';

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(storageFileSchema.partial()).nullable(),
});

const paramSchema = z.object({
  bucket: z.string(),
});

const listFilesAction = authAction
  .outputSchema(outputSchema)
  .schema(paramSchema)
  .action(async ({ parsedInput: { bucket } }) => {
    const { data, error } = await supabase.storage.from(bucket).list();

    if (error) {
      return {
        message: 'Une erreur est survenue lors de la récupération des fichiers',
        success: false,
        data: null,
      };
    }

    return {
      message: 'Les fichiers ont été récupérés avec succès',
      success: true,
      data,
    };
  });

export default listFilesAction;
