# Agentic development contract

Draft curated by Kryštof, 2026-09-11. This document is the **contract**: what the agentic
guardrails setup must guarantee, in plain English. The setup that implements it (tooling, CI,
GitHub configuration, tests) is designed and curated separately, against this contract. Terms
use MUST/NEVER deliberately.

## Mission

We want AI coding agents and humans to ship changes to this platform safely with minimal human
review capacity. The candidate policy this contract exists to validate: **product changes (UI,
content) are mergeable with no human code review**, guaranteed by automated checks plus a human
looking at the running result — while **everything that can affect result correctness, data and
API contracts, shared infrastructure, or multi-country capability always gets human code review**.

## Definitions

- **Product scope** — a change that only affects how the application looks and behaves for the
  user and cannot affect calculated results, data/API contracts, or multi-country/multi-language
  capability.
- **Platform scope** — every other change.
- **Contract** — a human-curated, machine-enforced rule (this document's terms, and their
  encodings as tests and checks) that no change may violate, regardless of scope.
- **Instance** — one deployed application (one country site). A change is
  **instance-contained** when the files it touches can affect only that instance; every other
  change is **shared**.

## Terms

### Classifying a change

- **T1.** The scope of a change MUST be determined mechanically from the set of files it
  touches, against an explicit product allowlist. It is NEVER declared by the author. Anything
  mixed, unknown, renamed, or outside the allowlist is platform scope.
- **T2.** Blast radius MUST be determined mechanically the same way: which instances a change
  can affect. Files replicated across instance directories count as shared regardless of
  their path.

### Merging a change

- **T3.** Platform-scope changes MUST receive human code review before merge. No exceptions,
  no self-merge, no admin bypass.
- **T4.** Product-scope changes MAY merge without human code review — but only when every
  contract passes (T6), correctness is proven per T7, and a human has approved the running
  result per T8. If any of those is unavailable — including a proof whose gate was never
  demonstrated per T11 — the change falls back to human code review. A product-scope change
  MUST additionally be bounded and coherent: a single describable intent whose full effect a
  human can assess from the running result. The setup MUST enforce an explicit mechanical
  size limit; a change exceeding it cannot use this lane and must be split — or take human
  code review.
- **T5.** A shared change MUST be verified on every instance it can affect before merge —
  for product-scope shared changes, on every instance's running result, not just one.

### Contracts and proofs

- **T6.** Human-curated contracts are blocking for **all** scopes, product included. Agents can
  NEVER modify a contract; contracts change only through a human-reviewed change. A failing
  contract blocks the merge — the code adapts to the contract, never the reverse.
- **T7.** Product-scope correctness MUST be proven twice: (a) on fake, test-only fixture data
  with expected values derived independently of the implementation (hand-computed from
  published rules, never computed by the code under test) — the exact-numbers proof; and
  (b) by a smoke test against the live election content of every affected instance — the
  full flow completes without errors and results render, with no exact-value assertions,
  since live content changes independently. Tests MUST never read or write live voter data
  (real users' answers and sessions).
- **T8.** The merge decision for a product-scope change is made by a human looking at the
  running result (preview, visual diffs, automated browser-review report) — not at the code.
  This applies to every product-scope merge, one by one.

### The setup itself

- **T9.** Only server-side enforcement counts as a guarantee (repository rulesets, required
  checks, code ownership). Instructions, prompts, and local hooks are steering and MUST be
  treated as best-effort only.
- **T10.** All enforcement derives from a single source of truth. Hand-maintained copies of
  scope rules are forbidden; drift between the source and any generated enforcement MUST fail
  the pipeline.
- **T11.** No gate is trusted until it has been demonstrated to fail: when a check is
  introduced or changed, a deliberate violation MUST produce a red run, recorded as evidence.
  This applies to every check this contract requires, including the T7 proofs. It is a rule
  about the setup, demonstrated per gate — not repeated per change.
