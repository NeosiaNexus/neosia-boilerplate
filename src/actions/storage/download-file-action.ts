import { z } from 'zod';

import { authAction } from '@/lib/actions';
import supabase from '@/lib/supabase';

const paramSchema = z.object({
  bucket: z.string(),
  fileName: z.string(),
});

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.instanceof(Blob).nullable(),
});

const downloadFileAction = authAction
  .outputSchema(outputSchema)
  .schema(paramSchema)
  .action(async ({ parsedInput: { bucket, fileName } }) => {
    const { data, error } = await supabase.storage.from(bucket).download(fileName);

    if (error) {
      return {
        message: 'Une erreur est survenue lors du téléchargement du fichier',
        success: false,
        data: null,
      };
    }

    return {
      message: 'Le fichier a été téléchargé avec succès',
      success: true,
      data,
    };
  });

export default downloadFileAction;
