import { notFound } from "next/navigation";

import { isAllowedPrefix } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  // Validate prefix
  if (!isAllowedPrefix(first)) {
    notFound();
  }

  return (
    <div>
      <h1>Election Landing Page</h1>
      <p>Prefix: {first}</p>
      <p>Election: {second}</p>
    </div>
  );
}
