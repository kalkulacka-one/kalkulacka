export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ election: string }>;
}) {
  const { election } = await params;
  return (
    <div>
      <span>Param for election fetch: "{election}"</span>
      <main>{children}</main>
    </div>
  );
}
