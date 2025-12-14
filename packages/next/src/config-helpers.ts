import type { AppConfig } from "@/types/app-config";

type AppConfigWithDefaults = AppConfig & {
  i18n: AppConfig["i18n"] & {
    localePrefix: "always" | "as-needed" | "never";
  };
  theme: {
    defaultTheme: string;
  };
  footer: {
    showStatus: boolean;
    statusUrl?: string;
    showAnalytics: boolean;
    analyticsUrl?: string;
  };
};

export function withDefaults(config: AppConfig): AppConfigWithDefaults {
  return {
    ...config,
    i18n: {
      ...config.i18n,
      localePrefix: config.i18n.localePrefix ?? "as-needed",
    },
    theme: {
      defaultTheme: config.theme?.defaultTheme ?? "default",
    },
    footer: {
      showStatus: config.footer?.showStatus ?? true,
      statusUrl: config.footer?.statusUrl,
      showAnalytics: config.footer?.showAnalytics ?? true,
      analyticsUrl: config.footer?.analyticsUrl,
    },
  };
}
