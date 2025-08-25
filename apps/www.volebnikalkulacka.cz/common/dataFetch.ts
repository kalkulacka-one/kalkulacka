export async function fetchElection(group: string) {
  const res = await fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/election.json`);
  const data = await res.json();
  return data;
}

export async function fetchCalculatorGroup(group: string, electionId: string, electionKey: string, calculatorGroupId: string, calculatorGroupKey: string) {
  const res = await fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/calculator-group.json`);
  const data = await res.json();
  if (electionId === data.election.id && electionKey === data.election.key && calculatorGroupId === data.id && calculatorGroupKey === data.key) {
    return data;
  }
  return "Calculator group not found";
}

export async function fetchCalculator(group: string, calculator: string, calculatorGroupId: string) {
  const res = await fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/${calculator}/calculator.json`);
  const data = await res.json();
  if (calculatorGroupId === data.calculatorGroup.id) {
    return data;
  }
  return "Calculator not found";
}

export async function fetchCalculatorData(group: string, calculator: string) {
  const res = await Promise.all([
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/${calculator}/candidates-answers.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/${calculator}/candidates.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/${calculator}/organizations.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/${calculator}/persons.json`),
    fetch(`http://localhost:3000/www.volebnikalkulacka.cz/${group}/${calculator}/questions.json`),
  ]);
  const data = await Promise.all(res.map((res) => res.json()));
  return data;
}
