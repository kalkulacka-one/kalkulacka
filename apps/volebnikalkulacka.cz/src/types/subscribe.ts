import { z } from "zod";

export const subscribeBodySchema = z.object({
  email: z.string().email(),
});

export type SubscribeBody = z.infer<typeof subscribeBodySchema>;
