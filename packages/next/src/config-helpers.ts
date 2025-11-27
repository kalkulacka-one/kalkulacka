import type { AppConfig } from "./types/app-config";

export function withDefaults(config: AppConfig) {
  return {
    ...config,
    i18n: {
      ...config.i18n,
      localePrefix: config.i18n.localePrefix ?? ("as-needed" as const),
    },
    theme: config.theme ?? {},
    footer: config.footer ?? {},
  };
}
