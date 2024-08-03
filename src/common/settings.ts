import { z } from 'zod';

export const settingsSchema = z.object({
  branches: z.array(z.object({ name: z.string().min(1), enable: z.boolean() })),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
