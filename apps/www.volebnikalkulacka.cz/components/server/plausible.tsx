import Script from "next/script";

export function PlausibleScript() {
  const isProduction = process.env.VERCEL_ENV === "production";
  const analyticsEnabled = process.env.ENABLE_ANALYTICS === "true" || isProduction;
  const domain = process.env.ANALYTICS_DOMAIN;
  const useProxy = process.env.ANALYTICS_PROXY === "true";

  if (!analyticsEnabled) {
    return null;
  }

  if (!domain) {
    throw new Error("Missing `ANALYTICS_DOMAIN` environment variable");
  }

  const scriptSrc = useProxy ? "/js/script.tagged-events.outbound-links.js" : "https://plausible.io/js/script.tagged-events.outbound-links.js";

  return <Script defer data-domain={domain} src={scriptSrc} />;
}
