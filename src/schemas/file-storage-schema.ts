import { z } from 'zod';

const storageFileSchema = z.object({
  name: z.string(),
  bucket_id: z.string(),
  owner: z.string(),
  id: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  last_accessed_at: z.string(),
  metadata: z.record(z.any()),
  buckets: z.any(),
});

export default storageFileSchema;
