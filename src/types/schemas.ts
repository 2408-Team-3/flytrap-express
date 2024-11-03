import { z } from "zod";

export const responseSchema = z.object({
  status: z.number(),
  data: z.object({
    message: z.string(),
  }),
});
