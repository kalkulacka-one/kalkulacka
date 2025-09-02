export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  return (
    <section>
      <p>First: `{first}`</p>
      <p>Second: `{second}`</p>
      <main>{children}</main>
    </section>
  );
}
