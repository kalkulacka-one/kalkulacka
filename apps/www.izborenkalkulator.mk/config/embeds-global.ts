import type { embedsConfig } from "./embeds";

declare module "@kalkulacka-one/app/client" {
  interface AppEmbeds {
    Name: keyof typeof embedsConfig;
  }
}
