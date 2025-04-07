'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import supabase from '@/lib/supabase';

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      path: z.string(),
      fullPath: z.string(),
      publicUrl: z.string(),
    })
    .nullable(),
});

const paramSchema = z.object({
  file: z.custom<File>(f => f instanceof File && 'name' in f && 'size' in f, {
    message: 'Doit être un fichier valide',
  }),
  bucket: z.string(),
  path: z.string(),
  upsert: z.boolean().optional().default(true),
});

const uploadFile = authAction
  .outputSchema(outputSchema)
  .schema(paramSchema)
  .action(async ({ parsedInput: { bucket, file, path, upsert } }) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert,
    });

    if (error) {
      return {
        message: "Une erreur est survenue lors de l'upload du fichier",
        success: false,
        data: null,
      };
    }

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

    return {
      message: 'Le fichier a été uploadé avec succès',
      success: true,
      data: {
        id: data.id,
        path: data.path,
        fullPath: data.fullPath,
        publicUrl,
      },
    };
  });

export default uploadFile;
