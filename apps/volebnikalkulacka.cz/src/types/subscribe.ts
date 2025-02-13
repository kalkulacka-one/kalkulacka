import { z } from "zod";

export const subscribeBodySchema = z.object({
  email: z.string().email("Neplatný e-mail"),
});

export type SubscribeBody = z.infer<typeof subscribeBodySchema>;
