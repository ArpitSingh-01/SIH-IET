import { z } from 'zod';

export const createTimelineSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).nullable().optional(),
  event_date: z.string().min(1, 'Date is required'),
  event_time: z.string().nullable().optional(),
  display_order: z.number().int().optional().default(0),
  visible: z.boolean().optional().default(true),
});

export const updateTimelineSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  event_date: z.string().optional(),
  event_time: z.string().nullable().optional(),
  display_order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const reorderTimelineSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    display_order: z.number().int(),
  })),
});

export type CreateTimelineInput = z.infer<typeof createTimelineSchema>;
export type UpdateTimelineInput = z.infer<typeof updateTimelineSchema>;
export type ReorderTimelineInput = z.infer<typeof reorderTimelineSchema>;
