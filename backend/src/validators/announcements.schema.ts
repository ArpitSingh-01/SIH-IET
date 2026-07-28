import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  type: z.enum(['announcement', 'schedule']),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  internal_name: z.string().min(1, 'Name is required').max(100),
  pinned: z.boolean().optional().default(false),
  urgent: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
});

export const updateAnnouncementSchema = z.object({
  message: z.string().min(1).max(2000).optional(),
  internal_name: z.string().min(1).max(100).optional(),
  pinned: z.boolean().optional(),
  urgent: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
