// Single source of truth for change classification (contract T13).
// Everything that enforces scope – the `npm run scope` CLI, the Claude Code guard hook,
// the PR labeling workflow – derives its verdict from this file. Protected: agents never edit.

export type Tag = "presentation" | "interaction" | "editorial" | "calculation" | "platform" | "protected";

export type ChangedFile = {
  path: string;
  /** Previous path when git reports a rename; renames fail closed (contract T3). */
  renamedFrom?: string;
};

export type Escalation = { path: string; tag: Tag; reason: string };

export type Classification = {
  tags: Tag[];
  /** "product" = only product tags; otherwise the strictest non-product tag. */
  verdict: "product" | "calculation" | "platform" | "protected";
  /** Affected instances: app workspace names, or "*" for all (shared change). */
  instances: string[];
  escalations: Escalation[];
};

export const PRODUCT_TAGS: Tag[] = ["presentation", "interaction", "editorial"];

/** Size governance for the no-code-review lane (contract T5): target is advisory, hard blocks. */
export const SIZE_LIMITS = {
  targetFiles: 15,
  targetLines: 200,
  maxFiles: 40,
  maxLines: 800,
};

export const scopes = {
  /** Never autonomous; changes require the contract owner's review (contract T8, T11). */
  protected: [
    "contract/**",
    ".github/workflows/**",
    ".github/CODEOWNERS",
    ".claude/**",
    "AGENTS.md",
  ],

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
    // `interaction` derives from diff content, not paths: a product-path change that adds or
    // modifies a call to a state-changing action entry point (answer-store actions) carries it.
    // The scanner is an enforcement target (contract, Capability tags); until it exists the
    // no-code-review lane stays closed (T15). `platform` is the default for everything
    // unmatched (contract T3).
  } as Record<string, string[]>,

  /**
   * The CZ/SK/MK apps carry byte-replicated engine code under instance paths. These files are
   * shared regardless of path (contract T2) – and they are platform by default anyway, since
   * they match no product allowlist. Shrinks as the extraction moves the engine into packages/.
   */
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

/** Minimal glob matcher: supports `**`, `*`, `{a,b}`; everything else is literal. */
export function globToRegExp(glob: string): RegExp {
  let out = "";
  let i = 0;
  while (i < glob.length) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        out += glob[i + 2] === "/" ? "(?:[^/]+/)*" : ".*";
        i += glob[i + 2] === "/" ? 3 : 2;
      } else {
        out += "[^/]*";
        i += 1;
      }
    } else if (c === "{") {
      const end = glob.indexOf("}", i);
      const options = glob.slice(i + 1, end).split(",");
      out += `(?:${options.map((option) => option.replace(/[.+^$()|[\]\\]/g, "\\$&")).join("|")})`;
      i = end + 1;
    } else {
      out += c.replace(/[.+^$()|[\]\\]/g, "\\$&");
      i += 1;
    }
  }
  return new RegExp(`^${out}$`);
}

function matchesAny(path: string, globs: string[]): boolean {
  return globs.some((glob) => globToRegExp(glob).test(path));
}

function instanceOf(path: string): string | undefined {
  const match = path.match(/^apps\/([^/]+)\//);
  return match?.[1];
}

export function classify(files: ChangedFile[]): Classification {
  const tags = new Set<Tag>();
  const escalations: Escalation[] = [];
  const instances = new Set<string>();
  let shared = false;

  for (const file of files) {
    const { path } = file;

    if (file.renamedFrom) {
      tags.add("platform");
      escalations.push({ path, tag: "platform", reason: `renamed from ${file.renamedFrom} – renames fail closed (T3)` });
    }

    if (matchesAny(path, scopes.protected) || (file.renamedFrom && matchesAny(file.renamedFrom, scopes.protected))) {
      tags.add("protected");
      escalations.push({ path, tag: "protected", reason: "protected control plane (T8/T11)" });
      shared = true;
      continue;
    }

    if (matchesAny(path, scopes.sharedEvenIfInstancePath)) {
      shared = true;
      tags.add("platform");
      escalations.push({ path, tag: "platform", reason: "replicated engine layer – shared despite instance path (T2)" });
      continue;
    }

    const instance = instanceOf(path);
    if (instance) instances.add(instance);
    else shared = true;

    let matched: Tag | undefined;
    for (const [tag, globs] of Object.entries(scopes.tags)) {
      if (matchesAny(path, globs)) {
        matched = tag as Tag;
        break;
      }
    }

    if (matched) {
      tags.add(matched);
      if (matched === "calculation") {
        escalations.push({ path, tag: "calculation", reason: "result calculation – human code review always (T4)" });
      }
    } else {
      tags.add("platform");
      escalations.push({ path, tag: "platform", reason: "no product allowlist match – fail closed (T3)" });
    }
  }

  const verdict: Classification["verdict"] = tags.has("protected")
    ? "protected"
    : tags.has("platform")
      ? "platform"
      : tags.has("calculation")
        ? "calculation"
        : "product";

  return {
    tags: [...tags].sort(),
    verdict,
    instances: shared ? ["*"] : [...instances].sort(),
    escalations,
  };
}
