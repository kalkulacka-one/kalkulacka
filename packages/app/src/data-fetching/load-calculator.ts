import { type Calculator, calculatorSchema } from "@kalkulacka-one/schema";

import { parseWithSchema } from "@/utilities";

import { fetchFile } from "./fetch-file";
import { buildDataUrl } from "./url-builders";

export async function loadCalculator({ endpoint, key, group }: { endpoint: string; key: string; group?: string }): Promise<Calculator> {
  const raw = await fetchFile({ url: buildDataUrl({ endpoint, key, group, resourcePath: "calculator.json" }) });
  return parseWithSchema({ data: raw, schema: calculatorSchema });
}
