import { type CalculatorGroup, calculatorGroupSchema } from "@kalkulacka-one/schema";

import { parseWithSchema } from "@/utilities";

import { fetchFile } from "./fetch-file";
import { buildDataUrl } from "./url-builders";

export async function loadCalculatorGroup({ endpoint, group }: { endpoint: string; group: string }): Promise<CalculatorGroup> {
  const raw = await fetchFile({ url: buildDataUrl({ endpoint, key: group, resourcePath: "calculator-group.json" }) });
  return parseWithSchema({ data: raw, schema: calculatorGroupSchema });
}
