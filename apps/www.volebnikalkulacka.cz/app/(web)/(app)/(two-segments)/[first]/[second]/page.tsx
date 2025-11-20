import { allowedPrefixGuard } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  allowedPrefixGuard(first);

  return (
    <div>
      <h1>Election Landing Page</h1>
      <p>Prefix: {first}</p>
      <p>Election: {second}</p>
    </div>
  );
}
