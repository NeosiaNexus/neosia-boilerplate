'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import prisma from '@/lib/prisma';
import { getBucketOrCreate, getPresignedUrl, storage } from '@/lib/storage';
import { pathSchema } from '@/schemas/common-schema';

const paramSchema = z.object({
  bucket: z.string().min(1),
  path: pathSchema,
  fileData: z.object({
    name: z
      .string()
      .min(1)
      // eslint-disable-next-line no-useless-escape
      .regex(/^[a-zA-Z0-9\/\-_\.]+$/, 'Nom invalide'),
    size: z.number().positive(),
    type: z.string().nonempty(),
    arrayBuffer: z.instanceof(ArrayBuffer),
  }),
});

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      path: pathSchema,
      publicUrl: z.string(),
    })
    .nullable(),
});

export const uploadFileAction = authAction
  .schema(paramSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { bucket, path, fileData }, ctx: { session } }) => {
    try {
      await getBucketOrCreate(bucket);
    } catch {
      return {
        message: 'Le bucket n’existe pas et n’a pas pu être créé',
        success: false,
        data: null,
      };
    }

    const ext = fileData.name.split('.').pop()!;
    const base = fileData.name.replace(new RegExp(`\\.${ext}$`), '');
    const objectKey = `${path}/${base}.${ext}`;

    const buffer = Buffer.from(fileData.arrayBuffer);

    try {
      await storage.putObject(bucket, objectKey, buffer, buffer.length, {
        'Content-Type': fileData.type,
      });
    } catch {
      return {
        message: 'Une erreur est survenue lors de l’upload du fichier',
        success: false,
        data: null,
      };
    }

    let publicUrl: string;
    try {
      publicUrl = await getPresignedUrl(bucket, objectKey);
    } catch {
      publicUrl = `${process.env.MINIO_ENDPOINT}/${bucket}/${objectKey}`;
    }

    let record;
    try {
      record = await prisma.storageFile.create({
        data: {
          bucket,
          path: objectKey,
          publicUrl,
          fileName: fileData.name,
          size: fileData.size,
          type: fileData.type,
          uploaderId: session.user.id,
        },
      });
    } catch {
      return {
        message: 'Une erreur est survenue lors de la création du fichier en base',
        success: false,
        data: null,
      };
    }

    return {
      message: 'Le fichier a été uploadé avec succès',
      success: true,
      data: {
        id: record.id,
        path: record.path,
        publicUrl: record.publicUrl,
      },
    };
  });

export default uploadFileAction;
