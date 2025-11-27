export interface AppConfig {
  domainPath: string;

  i18n: {
    defaultLocale: string;
    locales: readonly string[];
    localePrefix?: "always" | "as-needed" | "never";
  };

  theme?: {
    defaultTheme?: string;
  };

  footer?: {
    showStatus?: boolean;
    statusUrl?: string;
    showAnalytics?: boolean;
    analyticsUrl?: string;
  };
}
