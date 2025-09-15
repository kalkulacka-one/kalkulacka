import Script from "next/script";

export function PlausibleScript() {
  const isProduction = process.env.VERCEL_ENV === "production";
  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" || isProduction;
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;

  if (!analyticsEnabled) {
    return null;
  }

  if (!domain) {
    throw new Error("Missing `NEXT_PUBLIC_ANALYTICS_DOMAIN` environment variable");
  }

  return <Script defer data-domain={domain} src="/js/script.tagged-events.outbound-links.js" />;
}
