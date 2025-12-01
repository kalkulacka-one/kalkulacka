import type messages from "@/messages/cs.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}
