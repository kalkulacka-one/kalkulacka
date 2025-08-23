export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ calculator: string }>;
}) {
  const { calculator } = await params;
  return (
    <div>
      <span>Calculator: `{calculator}`</span>
      <main>{children}</main>
    </div>
  );
}
