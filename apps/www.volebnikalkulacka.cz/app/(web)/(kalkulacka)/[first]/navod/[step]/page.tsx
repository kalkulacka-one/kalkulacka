export default async function Page({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  return (
    <section>
      <h2>Návod</h2>
      <p>Step: {step}</p>
    </section>
  );
}
