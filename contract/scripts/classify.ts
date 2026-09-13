// Classification logic over contract/scopes.config.ts (contract T1–T3). Protected: agents never edit.

import { scopes } from "../scopes.config.ts";

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

const matchesAny = (path: string, globs: string[]) => globs.some((glob) => globToRegExp(glob).test(path));

const instanceOf = (path: string) => path.match(/^apps\/([^/]+)\//)?.[1];

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

    const matched = (Object.entries(scopes.tags) as [Tag, string[]][]).find(([, globs]) => matchesAny(path, globs))?.[0];
    if (!matched) {
      tags.add("platform");
      escalations.push({ path, tag: "platform", reason: "no product allowlist match – fail closed (T3)" });
    } else {
      tags.add(matched);
      if (matched === "calculation") escalations.push({ path, tag: "calculation", reason: "result calculation – human code review always (T4)" });
    }
  }

  const verdict: Classification["verdict"] = tags.has("protected")
    ? "protected"
    : tags.has("platform")
      ? "platform"
      : tags.has("calculation")
        ? "calculation"
        : "product";

  return { tags: [...tags].sort(), verdict, instances: shared ? ["*"] : [...instances].sort(), escalations };
}
