import { type Election, electionSchema } from "@kalkulacka-one/schema";

import { parseWithSchema } from "@/utilities";

import { fetchFile } from "./fetch-file";
import { buildDataUrl } from "./url-builders";

export async function loadElection({ endpoint, group }: { endpoint: string; group: string }): Promise<Election> {
  const raw = await fetchFile({ url: buildDataUrl({ endpoint, key: group, resourcePath: "election.json" }) });
  return parseWithSchema({ data: raw, schema: electionSchema });
}
