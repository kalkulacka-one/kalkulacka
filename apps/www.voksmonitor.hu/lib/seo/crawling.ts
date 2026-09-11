export function allowCrawling(): boolean {
  return process.env.VERCEL_ENV === "production";
}
