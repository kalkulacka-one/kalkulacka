import { buildDataUrl, fetchFile, NotFoundError, parseWithSchema } from "@kalkulacka-one/app";
import { type CalculatorGroup, calculatorGroupSchema, type District, type Election, electionSchema, type Round } from "@kalkulacka-one/schema";

import type { z } from "zod";

import { electionName } from "@/config/calculator-names";

/**
 * One calculator of a district election, ready to be listed in a picker.
 *
 * The group's own `calculator-group.json` lists nothing but keys, so the names
 * come from the districts in the election's `election.json`, joined on the
 * district key. That join is the whole point of this loader: a city or
 * constituency must never be named by a map in the app.
 */
export type GroupCalculator = {
  /** The calculator's key — the last URL segment. */
  key: string;
  /** The district's key, the one thing that ties a district's calculators together. */
  districtKey: string;
  /** The district's name, e.g. "Beroun" or "Cheb". */
  districtName: string;
  /** The district's official code, e.g. a Senate constituency number. */
  districtCode?: string;
  /** The region the district sits in, where the data groups districts under one. */
  region?: { key: string; name: string };
  /** The variant key for a calculator that is a variant of its district's, e.g. `inventura`. */
  variantKey?: string;
  /** The round this calculator is for — its own, or the election's first where the data gives it no round of its own. */
  round?: number;
};

export type CalculatorGroupListing = {
  groupKey: string;
  /** The election's display name, from the config. */
  electionName?: string;
  /** Picker copy the data may override. */
  selection?: {
    title?: string;
    description?: string;
    searchPlaceholder?: string;
    showCode?: boolean;
  };
  /** Every round the election has, in the data's order. */
  rounds?: Round[];
  calculators: GroupCalculator[];
};

function dataEndpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

async function loadGroupFile<T>({ group, filename, schema }: { group: string; filename: string; schema: z.ZodSchema<T> }): Promise<T> {
  const url = buildDataUrl({ endpoint: dataEndpoint(), key: group, resourcePath: filename });
  return parseWithSchema({ data: await fetchFile({ url }), schema });
}

/**
 * The calculators of a district election, named from the data.
 *
 * Districts a calculator group references but the election does not describe
 * are dropped rather than shown under their bare key — a picker entry with no
 * name is worse than one entry fewer.
 */
export async function loadCalculatorGroup({ group }: { group: string }): Promise<CalculatorGroupListing> {
  const [calculatorGroup, election] = await Promise.all([
    loadGroupFile<CalculatorGroup>({ group, filename: "calculator-group.json", schema: calculatorGroupSchema }),
    loadGroupFile<Election>({ group, filename: "election.json", schema: electionSchema }),
  ]);

  const districts = new Map<string, District>((election.districts ?? []).map((district) => [district.key, district]));
  const defaultRound = election.rounds?.[0]?.number;

  const calculators = calculatorGroup.calculators.flatMap((calculator) => {
    const districtKey = "district" in calculator ? calculator.district?.key : undefined;
    const district = districtKey ? districts.get(districtKey) : undefined;
    if (!district) return [];

    const region = district.parent ? districts.get(district.parent) : undefined;

    return [
      {
        key: calculator.key,
        districtKey: district.key,
        districtName: district.shortTitle ?? district.title,
        districtCode: district.code,
        region: region ? { key: region.key, name: region.title } : undefined,
        variantKey: calculator.variant?.key,
        round: ("round" in calculator ? calculator.round?.number : undefined) ?? defaultRound,
      },
    ];
  });

  return {
    groupKey: group,
    electionName: electionName(group),
    selection: calculatorGroup.selection,
    rounds: election.rounds,
    calculators,
  };
}

/**
 * The same listing, or nothing at all where the group is not published yet.
 *
 * A calculator group appears in the data only once its election is ready, and
 * the page for one that is not there yet has to be a 404 rather than a crash:
 * these pages are prerendered, so a group the data endpoint does not serve
 * would otherwise fail the whole build — which is exactly what the 2026 groups
 * do everywhere but a local mirror, and what the real ones will do until the
 * day they are published.
 */
export async function loadPublishedCalculatorGroup({ group }: { group: string }): Promise<CalculatorGroupListing | undefined> {
  try {
    return await loadCalculatorGroup({ group });
  } catch (error) {
    if (error instanceof NotFoundError) return undefined;
    throw error;
  }
}
