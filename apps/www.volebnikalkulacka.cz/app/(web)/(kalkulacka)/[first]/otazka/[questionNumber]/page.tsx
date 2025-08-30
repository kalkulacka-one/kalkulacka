export default async function Page({ params }: { params: Promise<{ questionNumber: string }> }) {
  const { questionNumber } = await params;
  return (
    <section>
      <h2>Otázka</h2>
      <p>Číslo: {questionNumber}</p>
    </section>
  );
}
