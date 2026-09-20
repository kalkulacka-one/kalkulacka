import { dateTimeSchema } from "@kalkulacka-one/schema";

// Lets a preview deployment run at a chosen time.
export function now(): Date {
  const override = process.env.CURRENT_TIME_OVERRIDE;
  if (!override || process.env.VERCEL_ENV === "production") return new Date();
  const parsed = dateTimeSchema.safeParse(override);
  if (!parsed.success) throw new Error(`CURRENT_TIME_OVERRIDE must be an ISO 8601 date-time with an offset, got \`${override}\``);
  return new Date(parsed.data);
}
