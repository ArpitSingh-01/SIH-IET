import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phone: z.string().max(20).nullable().optional(),
  email: z.string().email().max(200).nullable().optional(),
  visible: z.boolean().optional().default(true),
  display_order: z.number().int().optional().default(0),
});

export const updateContactSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).nullable().optional(),
  email: z.string().email().max(200).nullable().optional(),
  visible: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
