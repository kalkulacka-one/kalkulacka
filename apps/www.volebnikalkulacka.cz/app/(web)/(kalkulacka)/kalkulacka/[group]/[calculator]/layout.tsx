export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ group: string; calculator: string }>;
}) {
  const { group, calculator } = await params;
  return (
    <section>
      <span>Group: `{group}`</span>
      <span>Calculator: `{calculator}`</span>
      <main>{children}</main>
    </section>
  );
}
