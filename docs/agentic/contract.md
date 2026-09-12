# Agentic development contract

Draft curated by Kryštof, 2026-09-11; revised 2026-09-12. This document is the
human-owned **contract**: what agentic guardrails MUST guarantee. Tooling, CI and repository
configuration implement it and are reviewed against it. `MUST`, `MUST NOT` and `SHOULD` are
normative. A stated **enforcement target** is not a current guarantee.

## Mission

Enable volunteers and their agents to make useful changes independently and asynchronously,
while requiring human attention only where it materially reduces risk. A human SHOULD review
the relevant result (rendered UI, interaction, text diff or structured data diff), not generated
code, when mechanical controls establish the important implementation properties.

The original Product/Platform distinction remains useful:

- **Product change** — presentation, interaction, editorial or election-data work that stays
  inside mechanically enforced capability boundaries.
- **Platform change** — dependencies, build/CI/deployment, schemas and APIs, storage/session/auth,
  security-sensitive code, shared architecture, agent configuration and repository rules, plus
  anything unknown or not mechanically contained.

Product is not synonymous with safe. Product changes MAY use a no-code-review lane only when all
rules below are enforced. Platform and calculation changes require human code review.

## Repository context and status

This is a multi-instance Turborepo. Country sites live in `apps/`; static copy currently appears
in app-local MDX/TSX pages and `messages/*.json`. `packages/design-system` contains shared visual
primitives; `packages/app` currently contains UI, answer state and
`src/result-calculation`; `packages/schema` defines election-data contracts; and
`packages/database`, app-local `lib/session`, `lib/api`, `lib/analytics` and `lib/monitoring` are
protected platform capabilities. Election content is currently fetched from an external
`DATA_ENDPOINT`, not stored in this repository.

The current module graph is not yet a capability boundary: `@kalkulacka-one/app` exports
components, data fetching and result calculation from one package entry point, while its client
entry point exposes a broad `setAnswer` state mutation. A future safe interaction lane needs a
narrow answer-selection capability and enforced imports around it.

At the time of writing, CI on `main` runs lint, typecheck, build, unit tests and available E2E
tests. This repository does **not yet** contain the classifier, capability-boundary checks,
SHA-bound review packets, semantic election-data diff, protected independent oracle or guardrail
conformance suite required for autonomous/no-code-review merging. GitHub rulesets and deployment
configuration are external and were not verified here. Until the required controls exist and
have passed conformance tests, T5 makes human code review the fallback.

## Definitions

- **Capability tag** — an additive, mechanically derived description of what a change can affect.
- **Gate** — a server-side blocking check or required human judgment.
- **Review packet** — SHA-bound evidence prepared for the remaining human judgment.
- **Artifact approval** — approval of a rendered UI, interaction, text or semantic data diff.
  It is not code review.
- **Code review** — human review of implementation and its correctness/security implications.
- **Independent approval** — approval by a person other than the author/requester and their agent.
- **Instance** — one deployed country/application site. A change is **instance-contained** only
  when mechanical boundaries prove it cannot affect another instance; otherwise it is shared.
- **Protected contract** — human-owned policy, enforcement or correctness evidence that an
  ordinary contributor agent cannot change or override.

## Terms

### Classifying a change

- **T1. Additive classification.** CI MUST derive all applicable capability tags from changed
  paths, dependency/import relationships and other mechanically inspectable behaviour. Authors
  MAY provide context but MUST NOT choose or reduce the tags. The required gates are the union of
  the gates for every tag.
- **T2. Path plus capability.** A path inside an allowed product scope is necessary but not
  sufficient for no-code-review treatment. The change MUST remain within mechanically enforced
  capability boundaries. A product component MUST NOT thereby gain access to calculation,
  election-data semantics, storage/session/auth, arbitrary network requests, telemetry, secrets,
  dependencies, schemas/APIs, or build/deployment behaviour. Adding a dependency or changing a
  lockfile is `platform`. These restrictions SHOULD be expressed as package entry points,
  dependency direction and import/lint rules, not agent instructions.
- **T3. Fail closed.** Unknown, unclassified, renamed, generated or mixed changes receive every
  tag that might apply; if that cannot be determined mechanically, they are `platform`. A missing,
  skipped, neutral or indeterminate required check is failure, not success.
- **T4. Blast radius.** CI MUST derive every affected instance. Replicated files count as shared;
  path location alone does not prove containment. A shared change MUST be checked on every
  affected instance, including full-flow smoke tests and relevant previews.

#### Capability tags and gates

| Tag | Includes | Required evidence and human judgment |
| --- | --- | --- |
| `presentation` | Layout, CSS, animation and visualization of already-computed values | Automated checks; affected-instance preview; product/visual artifact approval. The author/requester MAY approve. No code review when capability containment is proven. |
| `interaction` | New ways to invoke an existing safe action: keyboard, gesture, control or navigation | `presentation` gates plus behavioural invariants proving all input methods produce the same underlying state/action. Product/interaction artifact approval MAY be by the author/requester. Changing action or state semantics escalates. |
| `editorial` | Static information, FAQ, About pages and ordinary explanations | Build; markup/link checks; readable text diff and, where layout matters, preview. Ordinary copy MAY be approved by its author/requester. Protected substantive text requires independent editorial approval. |
| `election-data` | Elections, districts, candidates, parties/organizations, questions, answers, metadata, sources and assets | Schema, identity, relationship, duplicate, required-field, allowed-value, provenance/source and asset checks as applicable; structured semantic diff. Authoritative reproducible imports MAY need only requester spot-check/acceptance. Politically substantive data requires independent data/editorial approval. |
| `calculation` | Matching/scoring, result semantics, transformations or derived political/election metrics | Independent expected values, correctness tests and human correctness/code review. |
| `platform` | Dependencies; build, CI and deployment; schemas/APIs; database, storage/session/auth; network/telemetry; secrets; shared architecture; enforcement and agent/repository configuration | Full automated checks and human code review by an authorized independent reviewer. Additional security/operations approval where the affected system requires it. |

Protected substantive editorial content includes methodology, explanations of matching,
politically substantive election text, question wording, party/candidate answers and
interpretations of positions. Privacy/legal text SHOULD receive an independent domain review when
the change is substantive. A typo or neutral formatting correction does not require a second
volunteer merely because it is in a static page; the classifier SHOULD use an explicit protected
content map and fail closed when it cannot distinguish the cases.

Election-data validation MUST include, where applicable: schema validity; unique stable IDs;
valid election/district/party/candidate/question relationships; duplicate detection; required
fields and allowed answer values; provenance presence; source URL validity where feasible; asset
existence; and cross-file consistency. Its review packet SHOULD say, for example:

```text
Election: Czech Senate 2026
District: 23

Candidates added: 2
Candidates removed: 0

+ Jana Nováková
  party: XYZ
  source: https://…

+ Petr Svoboda
  party: ABC
  source: https://…
```

Because election data currently lives outside this repository, the system that publishes it MUST
apply the same lane and expose an immutable data revision, validation report and semantic diff to
the application preview. Application CI MUST NOT pretend that runtime smoke-testing the current
`DATA_ENDPOINT` reviewed a proposed external data change.

### Merging and human judgment

- **T5. Code-review fallback.** `calculation` and `platform` tags MUST receive human code review.
  A product-tagged change MAY merge without code review only after every applicable contract and
  gate passes. If any required proof or enforcement is unavailable or has not been demonstrated
  under T14, human code review is required. No self-approval, admin bypass or author-supplied label
  can satisfy an independent-review requirement.
- **T6. Review the unautomatable judgment.** Human review MUST be scoped to the judgment automation
  cannot make. Reviewers MUST NOT be required to inspect unrelated implementation details. The
  review packet MUST state exactly what the reviewer is approving and whether independence and/or
  code review is required. Artifact approval and code review are distinct records.
- **T7. Bounded intent.** A no-code-review change MUST be one coherent, describable intent whose
  complete product effect can be assessed from its review packet. The setup MUST enforce a
  mechanical size/complexity limit. Larger or heterogeneous changes MUST be split or code-reviewed.
- **T8. Exact-revision binding.** Classification, checks, data inputs, preview/diff artifacts and
  approvals MUST name the exact candidate commit SHA. An approval MUST become stale when a later
  commit could affect what was reviewed or the applicable classification/gates. The merge
  candidate is:

  ```text
  commit SHA
      ↓
  classification
      ↓
  automated checks
      ↓
  preview / text or semantic diff
      ↓
  required human approval
      ↓
  merge candidate
  ```

  Merge queue/revalidation SHOULD test that candidate against current `main`; a changed merge
  result MUST regenerate affected evidence and invalidate affected approvals.
- **T9. Correctness proof.** Calculation behaviour MUST be tested on fake, test-only fixtures with
  authoritative expected values derived independently from published rules (for example,
  hand-computed), not computed by the implementation under test. Every affected instance MUST also
  complete a smoke test using a pinned election-data revision: the flow completes and results
  render. Smoke tests do not substitute for exact-value assertions. Tests MUST NOT read or write
  live voter answers, sessions or personal data.

### Protected control plane and oracles

- **T10. Human-owned contracts.** This contract, classification policy, evaluator, critical CI,
  approval rules, protected repository/ruleset configuration and correctness oracles/fixtures are
  protected. Changes to them are `platform` and require strongly reviewed, independent approval.
  A failing contract blocks merge; application code adapts to the contract, not the reverse.
- **T11. No self-judging change.** A change MUST NOT modify or influence the classifier, contract,
  correctness oracle, enforcement mechanism or trusted CI configuration and then have that
  modified mechanism judge the same change. Trusted enforcement MUST run from a protected base
  revision or otherwise remain outside the ordinary contributor agent's authority.
- **T12. Oracle separation.** A change MUST NOT modify both behaviour under test and the
  authoritative expected values used to prove it in the autonomous/no-code-review lane. Changing
  authoritative calculation/election fixtures or expected results requires explicit escalation
  and human correctness review.
- **T13. Server-side, single source of truth.** Only server-side enforcement counts as a guarantee:
  protected workflow execution, required checks, rulesets and ownership/approval rules. Prompts,
  documentation and local hooks are best-effort steering. All generated policy and configuration
  MUST derive from one protected source of truth; drift or hand-maintained policy copies MUST fail.
- **T14. Guardrail conformance.** No gate is trusted until it has been demonstrated to fail on an
  intentionally invalid change. The governance system MUST have regression tests, run whenever
  enforcement changes and periodically against representative invalid fixtures. A gate is eligible
  to protect no-code-review merges only while its recorded negative test remains passing (that is,
  the invalid fixture is rejected).

The conformance suite MUST include at least:

| Intentionally invalid scenario | Required outcome |
| --- | --- |
| Presentation component imports `src/result-calculation` | FAIL or escalate to `calculation` |
| Product PR adds a dependency or changes a lockfile | FAIL or escalate to `platform` |
| Ordinary product PR changes a correctness oracle | FAIL or escalate to protected review |
| Agent changes this contract, classifier or trusted workflow | FAIL or escalate; base-revision enforcement still judges it |
| Artifact approval names an old SHA | FAIL |
| A required test did not run or reported neutral | FAIL |
| Unknown/unclassified file changes | FAIL CLOSED as `platform` |
| Shared component breaks one country instance | FAIL affected-instance checks |
| Agent requests a production secret | DENIED outside the repository |

## Asynchronous workflow and review packet

The normal workflow MUST require no meeting, chat or simultaneously available developer:

1. A human gives a bounded task to their agent.
2. The agent creates or updates a branch and pull request.
3. Trusted CI classifies the exact SHA and runs the union of applicable gates.
4. CI produces a reviewer-friendly, immutable review packet.
5. The packet asks for only the minimum remaining human judgment.
6. The appropriate human approves asynchronously.
7. Trusted auto-merge/merge queue revalidates and merges.

Every review packet MUST contain:

- exact commit SHA and, for external election content, immutable data revision;
- mechanically derived tags and affected instances;
- plain-language intent and summary of what changed;
- relevant previews, interaction recording, readable text diff and/or semantic data diff;
- sources, provenance and import recipe where relevant;
- automated checks, inputs, warnings and missing evidence;
- the exact remaining human judgment, who may supply it, whether independence is required, and
  whether code review is required.

The packet MUST make “what exactly am I supposed to check?” answerable without real-time
coordination.

## Agent authority and least privilege

Ordinary contributor agents MAY read the repository, create branches, edit task-scoped files, run
tests in a sandbox, push their branch, and create/update pull requests. Credentials SHOULD be
short-lived and scoped to those actions.

Ordinary contributor agents MUST NOT change repository protections/rulesets, approve their own
changes, bypass checks, merge protected changes, deploy production, access production secrets or
unnecessary user/personal data, weaken enforcement, or grant themselves permissions. Trusted
automation MAY auto-merge after all SHA-bound gates pass. High-impact permissions MUST be enforced
outside the model, not merely prohibited in its prompt.

## Practical examples

### Designer changes a question card

A card redesign or selected-answer animation is `presentation` if dependency/import rules prove it
cannot change answer or result semantics. CI builds/tests all affected instances and supplies the
relevant preview; the designer/requester approves the visual result. No code review is required.

### Designer introduces Tinder-like swiping

- A swipe animation shown only after an existing selection is `presentation`.
- A swipe that chooses an answer is `interaction`. It MUST call the same existing safe answer
  action as tap and keyboard input, with an invariant equivalent to:

  ```text
  tap Yes       \
  keyboard Yes  -> setAnswer({ questionId, answer: true })
  swipe right   /
  ```

CI proves equal underlying state for each input and provides an interaction preview. If the change
replaces answer-state semantics, changes persistence/scoring, accesses network/session capability,
or adds a gesture dependency, it gains `calculation` or `platform` and requires code review.

### Journalist changes static pages

An About-page typo or ordinary prose change is `editorial`: build and link/markup checks plus a
text diff (and preview when useful); the author/requester may approve. Methodology, matching
explanations and politically substantive prose require independent editorial approval. Neither
needs code review unless template/application behaviour or a platform capability changes.

### Data person changes election data

Adding 200 candidates is `election-data`: CI validates schema, IDs, relationships, duplicates,
fields, assets and provenance and presents a semantic diff. A pinned, reproducible import from an
authoritative source can be near-automatic, with requester spot-check/acceptance. Changing question
wording or a party answer is `election-data` + `editorial` and needs one independent substantive
approval, not code review. Parser/runtime/schema changes add `platform` and require code review.

### Developer adds a result-page feature

Displaying an already-computed value such as `result.topicScores` is `presentation` when mechanical
boundaries prove it cannot alter its meaning. Computing “the five answers most responsible for
compatibility” introduces a derived political metric and is `calculation`; it requires independent
expected values and human correctness/code review.

## Implementation rule

This contract describes the merge lane, not evidence that the lane exists. Autonomous/no-code-review
merges MUST remain disabled until every required invariant for that lane is implemented server-side,
its negative conformance case has been recorded, and branch protection requires it. Aspirational
controls SHOULD be tracked as enforcement targets without being reported as passing guarantees.
