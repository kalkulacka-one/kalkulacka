# Import Path Guidelines

This document defines the import path strategy for the Kalkulacka.1 codebase.

## The Rule

Import paths are determined by **barrel file boundaries**, not by file depth or directory proximity:

- **Within a barrel scope**: Use relative imports (`./`, `../`)
- **Outside a barrel scope**: Use `@/` path aliases through the target's barrel file

## What is a Barrel Scope?

A barrel scope is the directory tree managed by an `index.ts` barrel file. The barrel file acts as the public API for that module.

### Example Structure

```
calculator/
├── components/
│   ├── client/
│   │   ├── index.ts          ← Barrel (defines "client" scope)
│   │   ├── app-header.tsx
│   │   └── match-card.tsx
│   └── server/
│       ├── index.ts          ← Barrel (defines "server" scope)
│       ├── pages/
│       │   └── question.tsx
│       └── components/
│           └── layout.tsx
```

In this structure:
- `client/` and `server/` are **separate barrel scopes**
- `pages/` and `components/` are **within** the `server/` barrel scope

## Why This Rule?

### 1. Prevents Circular Dependencies

Relative imports across barrel boundaries can create circular dependency chains:

```typescript
// ❌ Can cause circular dependencies
// client/foo.ts
import { Bar } from "../server/bar";

// server/bar.ts
import { Foo } from "../client";  // client/index.ts exports Foo
```

Using the barrel enforces a dependency direction.

### 2. Enforces Public APIs

Barrel files define what's publicly exposed. Direct relative imports bypass this:

```typescript
// ❌ Bypasses public API
import { InternalHelper } from "../../server/internal/helper";

// ✅ Uses public API (may not even be exported!)
import { PublicHelper } from "@/calculator/components/server";
```

### 3. Creates Clear Architectural Boundaries

Cross-barrel imports via `@/` make dependencies explicit and easier to track.

### 4. Makes Code Extraction-Ready

Code that respects barrel boundaries is easier to extract into separate packages.

## Barrel Scopes in This Codebase

### Calculator Module

```
calculator/
├── view-models/
│   ├── client/index.ts       ← Client view-models barrel
│   └── server/index.ts       ← Server view-models barrel
├── components/
│   ├── client/index.ts       ← Client components barrel
│   └── server/index.ts       ← Server components barrel
└── stores/
    └── index.ts              ← Calculator stores barrel
```

### Session Module

```
lib/session/
├── client/index.ts           ← Client session barrel
├── server/index.ts           ← Server session barrel
└── shared/index.ts           ← Shared utilities barrel
```

## Examples

### ✅ Correct: Within Same Barrel Scope

```typescript
// calculator/components/server/pages/question.tsx
// Both files are within the "server" barrel scope

import { Layout } from "../components/layout";         // ✅ Relative
import { QuestionCard } from "../components/question-card";  // ✅ Relative
```

### ✅ Correct: Across Barrel Boundaries

```typescript
// calculator/components/server/pages/question.tsx
// "client" is a different barrel scope

import { AppHeader, WithCondenseOnScroll } from "@/calculator/components/client";  // ✅ Via barrel
```

### ❌ Incorrect: Relative Import Across Barrels

```typescript
// calculator/components/server/pages/question.tsx

import { AppHeader } from "../../client/app-header";  // ❌ Bypasses barrel
import { AppHeader } from "../../client";             // ❌ Relative to barrel
```

### ✅ Correct: Within Barrel, Deep Nesting

```typescript
// calculator/components/server/pages/nested/deep/component.tsx

import { Layout } from "../../../components/layout";   // ✅ Still within same barrel
```

### ❌ Incorrect: Same Directory via Barrel

```typescript
// calculator/components/client/foo.tsx

import { Bar } from "@/calculator/components/client";  // ❌ Within same barrel!
```

## How to Identify Violations

### Quick Test

When you write an import, ask:

> **"Does this import cross a barrel boundary?"**

If YES → use `@/` alias
If NO → use relative path

### Finding the Barrel Boundary

Trace upward from your current file until you find an `index.ts`. That's your barrel scope. If the target file requires tracing to a *different* `index.ts`, you're crossing boundaries.

#### Example Walkthrough

```
Current file: calculator/components/server/pages/question.tsx
Target import: AppHeader from client/

Step 1: Find my barrel
  calculator/components/server/pages/question.tsx
  calculator/components/server/pages/ (no index.ts)
  calculator/components/server/ (✓ has index.ts) ← MY BARREL

Step 2: Find target's barrel
  calculator/components/client/app-header.tsx
  calculator/components/client/ (✓ has index.ts) ← TARGET'S BARREL

Step 3: Compare
  server/ ≠ client/ → DIFFERENT BARRELS → use @/ alias
```

## Common Patterns

### Same Directory

```typescript
// Always relative for same directory
import { helper } from "./helper";
```

### Parent/Sibling Within Barrel

```typescript
// calculator/components/server/pages/question.tsx

import { Layout } from "../components/layout";      // ✅ Within barrel
```

### Cross-Barrel (Even if "Nearby")

```typescript
// calculator/components/server/pages/question.tsx

import { AppHeader } from "@/calculator/components/client";  // ✅ Different barrel
```

### Tests

Tests should follow the same rule as production code:

```typescript
// calculator/components/server/__tests__/layout.test.tsx

import { Layout } from "../layout";                           // ✅ Within barrel
import { AppHeader } from "@/calculator/components/client";   // ✅ Cross-barrel
```

## Exceptions

### No Exceptions

This rule has no exceptions. If you find a case where the rule seems problematic, it likely indicates:

1. The barrel structure needs adjustment
2. The code organization needs refactoring
3. A circular dependency that should be resolved

## Migration Checklist

When fixing violations:

1. ✅ Identify the import's source and target barrel scopes
2. ✅ If same scope: ensure using relative path
3. ✅ If different scope: ensure using `@/` alias through barrel
4. ✅ Verify the barrel exports the needed symbol
5. ✅ Run `npm run typecheck` to verify
6. ✅ Run `npm run test` to ensure no breakage

## Tools

### Finding Violations

Search for relative imports that might cross barrels:

```bash
# Find potential cross-barrel relative imports
grep -r 'from "\.\./\.\./client' apps/
grep -r 'from "\.\./\.\./server' apps/
grep -r 'from "\.\./\.\./shared' apps/
```

### Validating Barrel Exports

```bash
# Check what a barrel exports
cat calculator/components/client/index.ts
```

## Further Reading

- [TypeScript Barrel Files](https://basarat.gitbook.io/typescript/main-1/barrel)
- [Circular Dependencies in JavaScript](https://medium.com/@jamischarles/circular-dependencies-in-javascript-a-primer-16616cd40a08)
