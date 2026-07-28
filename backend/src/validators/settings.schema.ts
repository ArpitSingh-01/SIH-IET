import { z } from 'zod';

export const updateSettingSchema = z.object({
  value: z.string().nullable(),
  updated_by: z.string().min(1, 'Name is required').max(100),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
