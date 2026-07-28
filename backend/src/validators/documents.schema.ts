import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').nullable().optional(),
  type: z.enum(['notice', 'resource']),
  link_url: z.string().url('Must be a valid URL').nullable().optional(),
  visible: z.preprocess(
    (val) => (val === 'true' ? true : val === 'false' ? false : val),
    z.boolean().optional().default(true)
  ),
  display_order: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().int().optional().default(0)
  ),
});

export const updateDocumentSchema = createDocumentSchema.partial();
