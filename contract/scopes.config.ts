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
      "apps/*/calculator/components/**",
      "apps/*/components/client/themes/**",
      "apps/*/components/client/{header,hide-on-embed,embed-only,subscribe-form,city-signup-form}.tsx",
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

  /** The CZ/SK/MK apps carry byte-replicated engine code under instance paths: shared regardless
   *  of path (contract T2). Shrinks as the extraction moves the engine into packages/. */
  sharedEvenIfInstancePath: [
    "apps/*/lib/**",
    "apps/*/hooks/**",
    "apps/*/app/api/**",
    "apps/*/calculator/client.ts",
    "apps/*/calculator/index.ts",
    "apps/*/app/[locale]/(web)/(app)/**",
    "apps/*/app/[locale]/(embed)/**",
  ],

  /** Message files where values may change freely but keys and the routing subtree are frozen. */
  frozenMessageGlobs: ["apps/*/messages/*.json", "packages/app/src/locales/*.json"],
};
