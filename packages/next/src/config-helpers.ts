import type { AppConfig } from "./types/app-config";

type AppConfigWithDefaults = AppConfig & {
  i18n: AppConfig["i18n"] & {
    localePrefix: "always" | "as-needed" | "never";
  };
  theme: NonNullable<AppConfig["theme"]>;
  footer: NonNullable<AppConfig["footer"]>;
};

export function withDefaults(config: AppConfig): AppConfigWithDefaults {
  return {
    ...config,
    i18n: {
      ...config.i18n,
      localePrefix: config.i18n.localePrefix ?? "as-needed",
    },
    theme: config.theme ?? {},
    footer: config.footer ?? {},
  };
}
