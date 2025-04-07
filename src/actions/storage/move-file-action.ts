import { z } from 'zod';

import { authAction } from '@/lib/actions';
import supabase from '@/lib/supabase';

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});

const paramSchema = z.object({
  bucket: z.string(),
  fromPath: z.string(),
  toPath: z.string(),
});

const moveFileAction = authAction
  .outputSchema(outputSchema)
  .schema(paramSchema)
  .action(async ({ parsedInput: { bucket, fromPath, toPath } }) => {
    if (fromPath === toPath) {
      return {
        message: 'Le chemin source et le chemin destination sont identiques',
        success: false,
      };
    }

    const { error } = await supabase.storage.from(bucket).move(fromPath, toPath);

    if (error) {
      return {
        message: 'Une erreur est survenue lors du déplacement du fichier',
        success: false,
      };
    }

    return {
      message: 'Le fichier a été déplacé avec succès',
      success: true,
    };
  });

export default moveFileAction;
