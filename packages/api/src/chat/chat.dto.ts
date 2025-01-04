import { z } from 'zod';

export const SendUpdateSchema = z
  .object({
    find: z.string().describe('The original text to rewrite'),
    replace: z.string().describe('The text with which to replace the original text')
  })
  .describe('Schema for update tool input');
