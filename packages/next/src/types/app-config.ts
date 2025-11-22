export interface AppConfig {
  domainPath: string;

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
