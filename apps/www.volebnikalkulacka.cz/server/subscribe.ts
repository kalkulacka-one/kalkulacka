"use server";

import { prisma } from "@repo/database";
import { PrismaClientKnownRequestError } from "@repo/database/library";
import { z } from "zod";

const subscribeBodySchema = z.object({
  email: z.string().email("Neplatný formát"),
});

type SubscribeBody = z.infer<typeof subscribeBodySchema>;

export async function subscribe(body: SubscribeBody): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = subscribeBodySchema.safeParse(body);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Neplatná data" };
  }

  try {
    await prisma.subscription.create({
      data: {
        email: body.email,
      },
    });
    return { success: true };
  } catch (error) {
    // Treat duplicate email as success to avoid information leakage
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: true };
    }

    return { success: false, error: "Chyba při ukládání. Zkuste to prosím později." };
  }
}
