// Single source of truth for change classification (contract T13) – pure, human-curated data.
// The logic that interprets it lives in contract/scripts/classify.ts. Protected: agents never edit.

export const PRODUCT_TAGS = ["presentation", "interaction", "editorial"] as const;

/** Size governance for the no-code-review lane (contract T5): target is advisory, hard blocks. */
export const SIZE_LIMITS = { targetFiles: 15, targetLines: 200, maxFiles: 40, maxLines: 800 };

export const scopes = {
  /** Never autonomous; changes require the contract owner's review (contract T8, T11). */
  protected: [
    "contract/**",
    ".github/workflows/**",
    ".github/CODEOWNERS",
    ".claude/**",
    "AGENTS.md",
    "CLAUDE.md",
  ],

  /** Product allowlists per tag; every unmatched path is platform (contract T3). `interaction`
   *  derives from diff content, not paths – see the contract's Capability tags section. */
  tags: {
    presentation: [
      "packages/design-system/src/**",
      "packages/app/src/components/**",
      "packages/app/src/client/components/**",
      "apps/*/components/client/themes/**",
      "apps/*/components/client/{header,donate-card,subscribe-form,city-signup-form}.tsx",
      "apps/*/components/server/footer.tsx",
      "apps/*/app/globals.css",
      "apps/*/public/**",
      "apps/design-system.kalkulacka.one/stories/**",
    ],
    editorial: [
      "apps/*/app/[locale]/(web)/(content)/**",
      "apps/*/messages/*.json",
      "packages/app/src/locales/*.json",
    ],
    calculation: ["packages/app/src/result-calculation/**"],
  },

  /** What is left of the once-replicated engine layer after the extraction into packages/ –
   *  these remnants are still byte-identical across CZ/SK/MK (verified 2026-09-13): shared
   *  regardless of path (contract T2). Remove entries only when the copies genuinely diverge
   *  per instance or move into packages/. */
  sharedEvenIfInstancePath: [
    "apps/*/lib/**",
    "apps/*/hooks/**",
    "apps/*/app/api/**",
    "apps/*/app/[locale]/(web)/(app)/**",
    "apps/*/app/[locale]/(embed)/**",
  ],

  /** Message files: values change freely; keys change only in lockstep – every locale file in
   *  the same directory must end up with an identical key set, so no locale misses a string.
   *  (URL slugs live in config/route-slugs.ts – platform by path – since #600.) */
  lockstepMessageGlobs: ["apps/*/messages/*.json", "packages/app/src/locales/*.json"],
};
