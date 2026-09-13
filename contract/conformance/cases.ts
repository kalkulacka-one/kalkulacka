// Conformance fixtures (contract T14): intentionally shaped change sets and the verdict the
// classifier MUST produce. See conformance.test.ts. Protected: agents never edit.

import type { ChangedFile, Classification } from "../scripts/classify.ts";

export type ConformanceCase = {
  name: string;
  files: ChangedFile[];
  expect: Pick<Classification, "verdict"> & Partial<Pick<Classification, "tags" | "instances">>;
};

export const cases: ConformanceCase[] = [
  {
    name: "donate card tweak is product, CZ only",
    files: [{ path: "apps/www.volebnikalkulacka.cz/components/client/donate-card.tsx" }],
    expect: { verdict: "product", tags: ["presentation"], instances: ["www.volebnikalkulacka.cz"] },
  },
  {
    name: "extracted app component is product but shared (all instances)",
    files: [{ path: "packages/app/src/client/components/match-card.tsx" }],
    expect: { verdict: "product", tags: ["presentation"], instances: ["*"] },
  },
  {
    name: "design-system component is product but shared (all instances)",
    files: [{ path: "packages/design-system/src/components/client/button.tsx" }],
    expect: { verdict: "product", instances: ["*"] },
  },
  {
    name: "one engine file flips the same PR to platform",
    files: [
      { path: "apps/www.volebnikalkulacka.cz/components/client/donate-card.tsx" },
      { path: "apps/www.volebnikalkulacka.cz/lib/monitoring/report-error.ts" },
    ],
    expect: { verdict: "platform", instances: ["*"] },
  },
  {
    name: "result calculation is never product",
    files: [{ path: "packages/app/src/result-calculation/calculate-matches.ts" }],
    expect: { verdict: "calculation" },
  },
  {
    name: "lockfile is platform",
    files: [{ path: "package-lock.json" }],
    expect: { verdict: "platform" },
  },
  {
    name: "replicated engine under SK path is shared platform",
    files: [{ path: "apps/www.volebnakalkulacka.sk/app/api/sessions/route.ts" }],
    expect: { verdict: "platform", instances: ["*"] },
  },
  {
    name: "MK message values are editorial product",
    files: [{ path: "apps/www.izborenkalkulator.mk/messages/mk.json" }],
    expect: { verdict: "product", tags: ["editorial"], instances: ["www.izborenkalkulator.mk"] },
  },
  {
    name: "unknown path fails closed as platform",
    files: [{ path: "tools/new-thing/index.ts" }],
    expect: { verdict: "platform" },
  },
  {
    name: "rename out of the engine fails closed",
    files: [{ path: "apps/www.volebnikalkulacka.cz/components/client/auto-save.ts", renamedFrom: "apps/www.volebnikalkulacka.cz/hooks/auto-save.ts" }],
    expect: { verdict: "platform" },
  },
  {
    name: "contract edits are protected",
    files: [{ path: "contract/scopes.config.ts" }],
    expect: { verdict: "protected" },
  },
  {
    name: "CI workflow edits are protected",
    files: [{ path: ".github/workflows/build.yaml" }],
    expect: { verdict: "protected" },
  },
  {
    name: "content page copy is editorial product",
    files: [{ path: "apps/www.volebnikalkulacka.cz/app/[locale]/(web)/(content)/(pages)/o-projektu/page.mdx" }],
    expect: { verdict: "product", tags: ["editorial"] },
  },
];
