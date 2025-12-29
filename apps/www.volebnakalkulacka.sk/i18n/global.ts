import type { routing } from "@/i18n/routing";
import type messages from "@/messages/cs.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
