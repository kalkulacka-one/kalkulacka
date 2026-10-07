/** One entry of the calculators a site renders: a whole calculator group, or a single calculator (inside `group` when set) */
export type ListedCalculator = { group: string; key?: string; campaign?: boolean } | { group?: undefined; key: string; campaign?: undefined };

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

  links?: {
    privacy?: string;
  };

  /** The calculators this site renders; `campaign` features a group on the homepage. Every entry is listed in the sitemap */
  calculators?: readonly ListedCalculator[];

  sitemap?: {
    /** Content pages to list in the sitemap, as paths */
    pages?: readonly string[];
  };

  footer?: {
    showStatus?: boolean;
    statusUrl?: string;
    showAnalytics?: boolean;
    analyticsUrl?: string;
  };
}
