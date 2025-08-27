export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ first: string }>;
}) {
  const { first } = await params;
  return (
    <section>
      <p>First: `{first}`</p>
      <main>{children}</main>
    </section>
  );
}
