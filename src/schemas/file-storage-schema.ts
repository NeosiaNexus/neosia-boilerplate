import { z } from 'zod';

import { pathSchema } from './common-schema';

const storageFileSchema = z.object({
  path: pathSchema,
  publicUrl: z.string(),
});

export default storageFileSchema;
