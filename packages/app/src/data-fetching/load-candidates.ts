import { type Candidates, candidatesSchema } from "@kalkulacka-one/schema";

import { parseWithSchema } from "@/utilities";

import { fetchFile } from "./fetch-file";
import { buildDataUrl } from "./url-builders";

export async function loadCandidates({ endpoint, key, group }: { endpoint: string; key: string; group?: string }): Promise<Candidates> {
  const data = await fetchFile({ url: buildDataUrl({ endpoint, key, group, resourcePath: "candidates.json" }) });
  return parseWithSchema({ data, schema: candidatesSchema });
}
