import { z } from 'zod';

export const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').nullable().optional(),
  url: z.string().url('Must be a valid URL'),
  visible: z.boolean().optional().default(true),
  display_order: z.number().int().optional().default(0),
});

export const updateFormSchema = createFormSchema.partial();
