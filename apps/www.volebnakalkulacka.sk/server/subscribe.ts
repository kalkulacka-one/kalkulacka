"use server";

import { prisma } from "@kalkulacka-one/database";
import { PrismaClientKnownRequestError } from "@kalkulacka-one/database/library";

import { z } from "zod";

const subscribeBodySchema = z.object({
  email: z.string().trim().normalize("NFC").pipe(z.email("Neplatný formát")),
  origin: z.string(),
});

type SubscribeBody = z.infer<typeof subscribeBodySchema>;

export async function subscribe(body: SubscribeBody): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = subscribeBodySchema.safeParse(body);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Neplatné dáta" };
  }

  try {
    // Store the email as typed, but treat case variants as duplicates (the local part is case-sensitive, so we never rewrite it)
    const existing = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Subscription" WHERE origin = ${parsed.data.origin} AND lower(email) = lower(${parsed.data.email}) LIMIT 1
    `;
    if (existing.length > 0) {
      return { success: true };
    }

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

    return { success: false, error: "Chyba pri ukladaní. Skúste to prosím neskôr." };
  }
}
