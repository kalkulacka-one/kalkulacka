// import { promises as fs } from "fs";

// export async function getCalculatorGroupFile(
//   // add types
//   key: string,
//   instance: string = "volebnikalkulacka.cz",
//   fileName: string = "calculator-group.json",
// ) {
//   try {
//     const file = await fs.readFile(
//       // fix baseUrl path (probably string concat bug)
//       process.cwd() + `/../web/data/instance/${instance}/${key}/${fileName}`,
//       "utf8",
//     );
//     const data = JSON.parse(file);
//     return data;
//   } catch (error) {
//     throw new Error("Error reading calculator group file");
//   }
// }

// export async function getCalculator() {
//   return "Calculator function";
// }

export async function getCalculatorGroupFile(
  key: string,
  instance = "volebnikalkulacka.cz",
  fileName = "calculator-group.json",
) {
  try {
    const res = await fetch(
      `http://localhost:3000/data/instance/${instance}/${key}/${fileName}`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("Error retrieving calculator group file");
  }
}

export async function getCalculator(
  district: string,
  key: string,
  instance = "volebnikalkulacka.cz",
  fileName = "calculator.json",
) {
  const res = await fetch(
    `http://localhost:3000/data/instance/${instance}/${key}/${district}/${fileName}`,
  );
  const data = await res.json();
  return data;
}

export async function getQuestions(
  district: string,
  key: string,
  instance = "volebnikalkulacka.cz",
  fileName = "questions.json",
) {
  const res = await fetch(
    `http://localhost:3000/data/instance/${instance}/${key}/${district}/${fileName}`,
  );
  const data = await res.json();
  return data;
}
