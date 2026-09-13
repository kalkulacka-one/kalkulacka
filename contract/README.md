# Agentic development contract

This contract governs how changes enter this repository. Humans and AI coding agents contribute
independently and asynchronously; human attention goes where it reduces risk. Changes that only
affect what users see and read – **product** changes – can merge without human code review,
under the guarantees below. Changes that can affect result
correctness, data and API contracts, shared infrastructure, or multi-country capability –
**platform** changes – always receive human code review.

This contract governs this repository only; election content lives in the data repository and
is governed separately.

The contract is human-owned and machine-enforced. The tooling that implements it is built and
reviewed against this document, never the other way around. **MUST** and **NEVER** are normative. Everything under
`contract/` is **protected**: agents NEVER write here; changes land only through a pull request
reviewed by the contract owner.

## Definitions

- **Capability tag** – an additive, mechanically derived description of what a change can affect.
  A change carries every tag that applies; its gates are the union of the tags' gates.
- **Instance** – one deployed application (one country site). A change is **instance-contained**
  only when mechanical rules prove it cannot affect another instance; otherwise it is **shared**.
- **Contract** – a human-curated, machine-enforced rule (this document's terms and their encodings
  as tests and checks) that no change may violate, regardless of tags.
- **Politically substantive text** – methodology, question wording, answer and result labels,
  anything interpreting positions, and party- or candidate-specific visual prominence.
- **Standard checks** – typecheck, lint, tests, and build for every affected workspace.

## Capability tags

| Tag | Covers | Human review | Automated checks | Additional proof |
| --- | --- | --- | --- | --- |
| presentation | Layout, styling, animation, visualization of already-computed values | Running result | Standard + preview per affected instance | – |
| interaction | New ways to trigger an existing state-changing action (keyboard, gesture, control) | Running result | Standard + preview per affected instance | Input equivalence: every input method produces the identical underlying action |
| editorial | Static copy: content pages, message values | Text diff; politically substantive text needs independent approval | Standard + frozen message keys and routing | – |
| calculation | Matching, scoring, result semantics, derived political metrics | Code review, always | Standard | Independently derived expected values |
| platform | Everything else: dependencies and lockfiles, build/CI/deploy, schemas and APIs, storage/session/auth, network/telemetry, shared architecture, anything unknown | Code review, always | Standard | – |
| protected | This contract, CI workflows, agent and repository configuration, correctness oracles (fixtures and expected values) | Contract owner review, always | Standard | – |

The table summarizes; the terms govern. All tags derive from paths except interaction: a diff
in product paths that adds or changes an event binding, or any invocation path to state-changing
behavior, carries interaction – derived by a scanner, never the author (T1); reachability the
scanner cannot resolve escalates to platform (T3). Until that scanner carries its T14 evidence,
presentation and interaction are indistinguishable and the lane stays closed (T15).

## Terms

### Classifying a change

- **T1.** All applicable capability tags MUST be derived mechanically from the files a change
  touches, their content, and their imports. The author MAY add context but can NEVER choose,
  reduce, or override tags. A product tag holds only within enforced capability bounds: the
  change MUST NOT introduce network destinations, external scripts, or new reads of answer or
  session state – what cannot be proven within bounds is platform (T3).
- **T2.** Blast radius MUST be derived the same way: which instances a change can affect. Files
  replicated across instance directories count as shared regardless of their path.
- **T3.** Fail closed: unknown, unclassified, renamed, generated, or mixed changes escalate to
  platform. A required check that is missing, skipped, or indeterminate is a failure.

### Merging a change

- **T4.** Changes tagged calculation, platform, or protected MUST receive human code review
  before merge. No exceptions, no self-merge, no admin bypass.
- **T5.** Changes carrying only product tags (presentation, interaction, editorial) MAY merge
  without human code review – but only when every gate this contract requires of them passes
  (T8, T9, T10, T14); anything unavailable means human code review. A no-code-review change MUST be bounded and coherent: one describable intent whose full
  effect a human can assess from the running result. Size is governed by a target and a hard
  limit: over the target, the pull request MUST justify
  the size in its intent; over the hard limit, the lane is refused – split the change or take
  code review.
- **T6.** A shared change MUST be verified on every instance it can affect before merge – for
  product-tagged shared changes, on every instance's running result, not just one.
- **T7.** Classification, checks, previews, and approvals MUST be bound to the exact commit SHA
  they judged – and, where a proof depends on election content, to the content revision it ran
  against. Any later commit invalidates them.

### Contracts and proofs

- **T8.** Contracts are blocking for **all** tags, product included. Agents NEVER modify a
  contract; contracts change only through the contract owner's review. A failing contract blocks
  the merge – the code adapts to the contract, never the reverse.
- **T9.** Product-tagged correctness MUST be proven twice: (a) on fake, test-only fixture data
  with expected values derived independently of the implementation (hand-computed from published
  rules, never computed by the code under test) and asserted on the rendered result – candidate
  identity, score association, and ordering, not just the numbers; and (b) by a smoke
  test against the live election content of every affected instance – the full flow completes and
  results render, with no exact-value assertions. Tests
  NEVER read or write live voter data (real users' answers and sessions).
- **T10.** The merge decision for a product-tagged change is made by a human looking at the
  running result (preview, visual diffs, review report) – not at the code. Per merge, one by
  one. The requesting human may approve their own agent's result once every gate passes;
  independent approval is required only where the capability table says so.
- **T11.** No self-judging: a change MUST NOT modify the classifier, this contract, a correctness
  oracle, or trusted CI configuration and then be judged by what it modified – such changes are
  protected and judged by the unmodified base.

### The setup itself

- **T12.** Only server-side enforcement counts as a guarantee (rulesets, required checks, code
  ownership). Agent instructions, prompts, and local hooks are steering – valuable, never
  trusted. **Interim state:** until rulesets enforce this contract, the server-side gate is the
  contract owner reading and merging every pull request manually; the tooling makes that reading
  fast and violations loud.
- **T13.** All enforcement derives from one source of truth (`contract/scopes.config.ts`).
  Hand-maintained copies of scope rules are forbidden; drift between the source and anything
  generated from it MUST fail.
- **T14.** No gate is trusted until it has been demonstrated to fail: when a check is introduced
  or changed, a deliberate violation MUST produce a recorded red run. Conformance fixtures live
  in `contract/conformance/` and run whenever enforcement changes.
- **T15.** The no-code-review lane stays **off** until every gate it depends on exists, carries
  its T14 evidence, and is required by branch protection. Until then, every change merges through
  the interim gate of T12 – and this contract still governs how agents scope and describe their
  work.
