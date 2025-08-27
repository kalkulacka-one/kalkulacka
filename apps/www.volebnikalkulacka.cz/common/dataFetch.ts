export async function fetchElection(first: string) {
  const res = await fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${first}/election.json`);
  const data = await res.json();
  return data;
}

export async function fetchCalculatorData(first: string, second: string) {
  const res = await Promise.all([
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${first}/${second}/calculator.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${first}/${second}/candidates-answers.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${first}/${second}/candidates.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${first}/${second}/organizations.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${first}/${second}/persons.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${first}/${second}/questions.json`),
  ]);
  const data = await Promise.all(res.map((res) => res.json()));
  return data;
}
