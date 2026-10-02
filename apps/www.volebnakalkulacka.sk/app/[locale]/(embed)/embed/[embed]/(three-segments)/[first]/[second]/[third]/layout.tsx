import Layout from "@/app/[locale]/(web)/(app)/(three-segments)/[first]/[second]/[third]/layout";

// On-demand ISR: nothing is prerendered at build, each path renders on its first request and is then served from cache, re-rendered at most once a minute (matches the data fetch revalidation).
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

export default Layout;
