export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ first: string; second: string }>;
}) {
  const { second } = await params;
  return (
    <section>
      <p>Second: `{second}`</p>
      <main>{children}</main>
    </section>
  );
}
