import { z } from 'zod';

export const registerTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const sendNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title too long'),
  body: z.string().min(1, 'Body is required').max(200, 'Body too long'),
  url: z.string().url().optional().default('/'),
});

export type RegisterTokenInput = z.infer<typeof registerTokenSchema>;
export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
