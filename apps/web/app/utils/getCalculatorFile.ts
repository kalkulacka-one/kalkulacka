export default async function getCalculatorFile(district: any) {
  const res = await fetch(
    `http://localhost:3000/data/instance/volebnikalkulacka.cz/krajske-2024/${district}/calculator.json`,
  );
  const data = await res.json();
  return data;
}
