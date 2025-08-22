export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ kalkulacka: string }>;
}) {
  const { kalkulacka } = await params;
  return (
    <div>
      <span>Param for election fetch: "{kalkulacka}"</span>
      <main>{children}</main>
    </div>
  );
}
