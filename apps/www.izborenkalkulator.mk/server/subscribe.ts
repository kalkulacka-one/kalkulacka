"use server";

import { prisma } from "@kalkulacka-one/database";
import { PrismaClientKnownRequestError } from "@kalkulacka-one/database/library";

import { z } from "zod";

const subscribeBodySchema = z.object({
  email: z.string().email("Неважечки формат"),
  origin: z.string(),
});

type SubscribeBody = z.infer<typeof subscribeBodySchema>;

export async function subscribe(body: SubscribeBody): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = subscribeBodySchema.safeParse(body);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Неважечки податоци" };
  }

  try {
    await prisma.subscription.create({
      data: {
        email: parsed.data.email,
        origin: parsed.data.origin,
      },
    });
    return { success: true };
  } catch (error) {
    // Treat duplicate email as success to avoid information leakage
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: true };
    }

    return { success: false, error: "Грешка при зачувување. Обидете се повторно подоцна." };
  }
}
