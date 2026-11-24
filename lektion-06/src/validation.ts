import { z } from 'zod';
export const PromptBody = z.object({prompt:z.string().trim().min(1).max(2000)}).strict();
