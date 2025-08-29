import { parse } from "path";
import { calculatorSchema } from "../../../packages/schema/schemas/calculator.schema";
export async function fetchCalculator(first: string, second?: string) {
  const domain = "www.volebnikalkulacka.cz";
  const baseUrl = `http://localhost:3000/${domain}/`;

  // first param

  // if (second === undefined) {
  //   return "Running first param only";
  // }

  // try {
  //   const res = await fetch(`${baseUrl}/${first}/calculator.json`);
  //   if (res.status === 404) {
  //     throw new Error("Error: calculator.json file missing");
  //   }
  //   if (res.status === 500) {
  //     throw new Error("Error on the server");
  //   }
  //   if (!res.ok) {
  //     throw new Error("Other error");
  //   }
  //   const data = await res.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error", error);
  // }

  // second param

  try {
    const res = await fetch(`${baseUrl}/${first}/${second}/calculator.json`);
    if (res.status === 404) {
      throw new Error("Error: calculator.json file missing");
    }
    if (res.status === 500) {
      throw new Error("Error on the server");
    }
    if (!res.ok) {
      throw new Error("Other error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function parseCalculator(first: string, second: string) {
  const calculator = await fetchCalculator(first, second);
  const parseCalculator = calculatorSchema.safeParse(calculator);
  if (parseCalculator.success) {
    console.log(parseCalculator);
    return parseCalculator.data;
  }
  if (!parseCalculator.success) {
    console.log(parseCalculator);
    throw Error("Error", parseCalculator.error);
  }
}
