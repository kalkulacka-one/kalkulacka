"use server";

import { prisma } from "@kalkulacka-one/database";
import { PrismaClientKnownRequestError } from "@kalkulacka-one/database/library";

import { z } from "zod";

import { campaignCities } from "@/config/campaign-cities";

const citySignupBodySchema = z.object({
  email: z.string().email("Neplatný formát"),
  city: z.enum(campaignCities, { message: "Vyberte město ze seznamu" }),
});

type CitySignupBody = z.infer<typeof citySignupBodySchema>;

const origin = "city-signup-form";

export async function citySignup(body: CitySignupBody): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = citySignupBodySchema.safeParse(body);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Neplatná data" };
  }

  const { email, city } = parsed.data;

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mergeCityIntoSubscription(email, city);
      return { success: true };
    } catch (error) {
      // Retry on a lost race: P2002 when a concurrent signup wins the create,
      // P2034 when CockroachDB aborts one of the concurrent serializable transactions
      const isRetryable = error instanceof PrismaClientKnownRequestError && (error.code === "P2002" || error.code === "P2034");
      if (isRetryable && attempt < maxAttempts) {
        continue;
      }
      console.error("citySignup failed", error);
      return { success: false, error: "Chyba při ukládání. Zkuste to prosím později." };
    }
  }

  return { success: false, error: "Chyba při ukládání. Zkuste to prosím později." };
}

async function mergeCityIntoSubscription(email: string, city: string): Promise<void> {
  // Transaction so concurrent signups cannot lose a city to a read-modify-write race
  await prisma.$transaction(async (transaction) => {
    const existing = await transaction.subscription.findUnique({ where: { email_origin: { email, origin } } });

    if (existing) {
      const metadata = typeof existing.metadata === "object" && existing.metadata !== null && !Array.isArray(existing.metadata) ? existing.metadata : {};
      const previousCities = Array.isArray(metadata.cities) ? metadata.cities.filter((item): item is string => typeof item === "string") : [];
      const cities = previousCities.includes(city) ? previousCities : [...previousCities, city];
      await transaction.subscription.update({
        where: { email_origin: { email, origin } },
        data: { metadata: { ...metadata, cities } },
      });
    } else {
      await transaction.subscription.create({
        data: {
          email,
          origin,
          metadata: { cities: [city] },
        },
      });
    }
  });
}
