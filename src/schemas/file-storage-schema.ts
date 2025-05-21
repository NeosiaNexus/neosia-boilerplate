import { z } from 'zod';

import { pathSchema } from './common-schema';

const storageFileSchema = z.object({
  path: pathSchema,
  bucket: z.string(),
});

export type storageFileType = z.infer<typeof storageFileSchema>;
export default storageFileSchema;
