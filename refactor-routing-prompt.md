# Refactor: Remove Hardcoded `/volby` Prefix and Support Flexible Route Segments

## Current State

The app currently has routing under a hardcoded `/volby` prefix with two patterns:
- `/volby/[first]/` - for calculators like `/volby/snemovni-2025`
- `/volby/[first]/[second]/` - for calculators like `/volby/krajske-2024/jihomoravsky`

Both patterns support the full calculator flow with subroutes: `/`, `/uvod`, `/navod`, `/otazka/[questionNumber]`, `/porovnani`, `/rekapitulace`, `/vysledek`

## The Problem

The `/volby` prefix is hardcoded but shouldn't be. It's just cosmetic URL decoration. We need to support:
- Standalone calculators: `/sametova-kalkulacka`
- Election landing pages: `/volby/snemovni-2025` (2 segments)
- Group calculators: `/inventura-2025/expresni` (2 segments)
- Namespaced calculators: `/volby/krajske-2026/moravskoslezsky` (3 segments)

## How Segments Map

**Critical:** Segments map **from the end backwards**:
- **Last segment** = calculator key (always)
- **Second-to-last segment** = group key (if exists)
- **Prefix segments** = validated but not passed to data layer

Examples:
```
/sametova-kalkulacka
  → loadCalculatorData({ key: "sametova-kalkulacka" })

/inventura-2025/expresni
  → loadCalculatorData({ group: "inventura-2025", key: "expresni" })

/volby/krajske-2026/moravskoslezsky
  → Validate "volby" is allowed
  → loadCalculatorData({ group: "krajske-2026", key: "moravskoslezsky" })
  // "volby" validated but not passed to loadCalculatorData

/invalid-prefix/krajske-2026/moravskoslezsky
  → 404 error (prefix not in allowed list)
```

## URL Prefix Validation

**IMPORTANT:** For 2-segment and 3-segment routes, the first segment must be validated:

1. **Define allowed prefixes** (e.g., in a config file or constant):
```tsx
const ALLOWED_PREFIXES = ["volby", "inventura"] as const;
```

2. **Validate in route handlers:**
```tsx
// (two-segments)/[first]/[second]/page.tsx
const { first, second } = await params;

// If first is NOT in allowed list AND this looks like it needs a prefix, throw 404
if (!ALLOWED_PREFIXES.includes(first)) {
  notFound();
}
```

3. **For 2-segment routes:** Decide if ALL must have validated prefixes, or if some are prefix-less
   - Example: `/inventura-2025/expresni` - is "inventura-2025" a prefix or a group?
   - You need to clarify this logic!

**Question for implementation:** Should 2-segment routes ALWAYS require prefix validation, or can they be prefix-less groups? This affects whether `/inventura-2025/expresni` is valid.

## Special Requirement: Election Landing Pages

For 2-segment patterns like `/volby/snemovni-2025`, the root page (`page.tsx`) should be an **election landing page**, not a calculator intro.

Create a simple landing page component that displays the URL params (for now, just print them). Example:
```tsx
// (two-segments)/[first]/[second]/page.tsx
export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  // Validate prefix
  if (!ALLOWED_PREFIXES.includes(first)) {
    notFound();
  }

  return (
    <div>
      <h1>Election Landing Page</h1>
      <p>Prefix: {first}</p>
      <p>Election: {second}</p>
    </div>
  );
}
```

The calculator flow routes (`/uvod`, `/navod`, etc.) should continue to work as calculator pages.

## Required Refactor

Transform the current structure:
```
app/(web)/(app)/volby/
  ├── (one-segment)/[first]/
  └── (two-segments)/[first]/[second]/
```

Into:
```
app/(web)/(app)/
  ├── (one-segment)/[first]/
  ├── (two-segments)/[first]/[second]/
  └── (three-segments)/[first]/[second]/[third]/
```

**Route behavior:**

**(one-segment)**: Standalone calculator
- `/` - calculator intro
- All calculator subroutes (`/uvod`, `/navod`, `/otazka/[n]`, etc.)

**(two-segments)**: Election/group landing page
- **Validate first segment** against allowed prefixes
- `/` - **election landing page** (display params)
- All calculator subroutes still work (`/uvod`, `/navod`, `/otazka/[n]`, etc.)

**(three-segments)**: Namespaced calculator
- **Validate first segment** against allowed prefixes
- `/` - calculator intro
- All calculator subroutes (`/uvod`, `/navod`, `/otazka/[n]`, etc.)

## Implementation Details

1. **Define allowed prefixes** in a shared config/constant file

2. **Create new route structures** at `app/(web)/(app)/(one-segment)/`, `(two-segments)/`, `(three-segments)/`

3. **Add prefix validation** in 2-segment and 3-segment routes:
```tsx
import { notFound } from "next/navigation";

// Validate and throw 404 if invalid
if (!ALLOWED_PREFIXES.includes(first)) {
  notFound();
}
```

4. **Update layout.tsx files** to extract correct params:
```tsx
// (three-segments)/[first]/[second]/[third]/layout.tsx
const { first, second, third } = await params;

// Validate prefix
if (!ALLOWED_PREFIXES.includes(first)) {
  notFound();
}

// Only pass second (group) and third (key) to data layer
const calculatorData = await loadCalculatorData({ group: second, key: third });
```

5. **Create election landing page** for two-segments root with validation

6. **Copy all 8 subroute files** to each new structure (they're thin wrappers calling shared components)

7. **Update embed routes** similarly under `app/(embed)/embed/[embed]/`

8. **Update URL builders** in `lib/routing/url-builders` to handle 1/2/3 segments

9. **Update redirects** in `next.config.ts` to remove `/volby` hardcoding

10. **Test that shared components** work with all segment patterns

11. **Remove old `/volby` route structure** after verifying everything works

## Critical Requirements

- All existing calculator flows must continue working
- Invalid prefixes must return 404
- Shared components should remain unchanged (they already accept flexible segment props)
- Preserve type safety for all route params
- **MUST run mandatory checks after completion:**
  1. `npm run typecheck`
  2. `npm run lint:fix`
  3. `npm run test`

## Success Criteria

- ✅ Can access standalone calculator: `/sametova-kalkulacka/uvod`
- ✅ Can access election landing: `/volby/snemovni-2025` (shows params)
- ✅ Invalid prefix returns 404: `/invalid/snemovni-2025` → 404
- ✅ Can access 2-segment calculator subroutes: `/volby/expresni/otazka/1`
- ✅ Can access 3-segment calculator: `/volby/krajske-2026/moravskoslezsky/vysledek`
- ✅ All subroutes work for all patterns
- ✅ Embed routes support all patterns
- ✅ All type checks pass
- ✅ All tests pass
