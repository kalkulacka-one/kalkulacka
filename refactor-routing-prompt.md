# Routing Refactor - Completed Implementation Notes

## What Was Done

The `/volby` hardcoded prefix has been successfully removed and replaced with a flexible route segment system that supports 1/2/3 segment patterns.

## Implementation Summary

### Route Structure Created

Transformed from:
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

### How Segments Map

**Critical insight:** Segments map **from the end backwards**:
- **Last segment** = calculator key (always)
- **Second-to-last segment** = group key (if exists and not prefixed)
- **First segment** = optional prefix (validated but not passed to data layer)

Examples:
```
/sametova-kalkulacka
  → key: "sametova-kalkulacka"
  → loadCalculatorData({ key: "sametova-kalkulacka" })

/inventura-2025/expresni
  → key: "expresni", group: "inventura-2025"
  → loadCalculatorData({ key: "expresni", group: "inventura-2025" })

/volby/snemovni-2025
  → "volby" is a validated prefix
  → key: "snemovni-2025", group: undefined
  → loadCalculatorData({ key: "snemovni-2025" })

/volby/krajske-2026/moravskoslezsky
  → "volby" is a validated prefix
  → key: "moravskoslezsky", group: "krajske-2026"
  → loadCalculatorData({ key: "moravskoslezsky", group: "krajske-2026" })
```

### Key Implementation Details

#### 1. Prefix Validation (`lib/routing/validators/prefix.ts`)
```typescript
export const PREFIXES = ["volby"];

export function isPrefix(segment: string): boolean {
  return PREFIXES.includes(segment);
}

export function validatePrefix(prefix: string): string {
  if (!PREFIXES.includes(prefix)) {
    throw new Error(`Invalid prefix \`${prefix}\``);
  }
  return prefix;
}
```

#### 2. Prefix Guard (`lib/routing/guards/prefix.ts`)
```typescript
export function prefixGuard(prefix: string): string {
  try {
    return validatePrefix(prefix);
  } catch {
    notFound(); // Returns 404 for invalid prefixes
  }
}
```

#### 3. Parameter Mapping (`lib/routing/params-mapper.ts`)

Smart extraction of key and group from segments:

```typescript
export const mappedParams = {
  key: (segments: RouteSegments) => {
    // Returns last segment
    if (segments.third) return segments.third;
    if (segments.second) return segments.second;
    return segments.first;
  },

  group: (segments: RouteSegments) => {
    // Returns second-to-last (if not a prefix)
    if (segments.third) return segments.second;
    if (segments.second && !isPrefix(segments.first)) return segments.first;
    return undefined;
  },
};
```

#### 4. Layout Implementation

**Three-segments layout** (validates prefix, maps params):
```typescript
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const segments = await params;
  const { first } = segments;

  prefixGuard(first); // Validates prefix, 404 if invalid

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const calculatorData = await loadCalculatorData({ key, group });

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
```

**Two-segments and one-segment layouts** follow similar patterns (two-segments validates prefix if first segment is a prefix).

### Route Behavior

**(one-segment)**: `/[first]/`
- Example: `/sametova-kalkulacka`
- No prefix validation
- Calculator intro at root
- All calculator subroutes available (`/uvod`, `/navod`, `/otazka/[n]`, etc.)

**(two-segments)**: `/[first]/[second]/`
- Examples: `/volby/snemovni-2025` OR `/inventura-2025/expresni`
- Validates first segment if it's in PREFIXES list
- **Root page redirects to introduction** (not a landing page)
- All calculator subroutes available

**(three-segments)**: `/[first]/[second]/[third]/`
- Example: `/volby/krajske-2026/moravskoslezsky`
- **Always validates first segment** (must be in PREFIXES)
- Calculator intro at root
- All calculator subroutes available

### Subroutes (All Patterns)

Each pattern supports the complete calculator flow:
- `/` - Calculator intro (or redirect to `/uvod` for two-segments)
- `/uvod` - Introduction
- `/navod` - Instructions
- `/otazka` - Questions redirect
- `/otazka/[questionNumber]` - Specific question
- `/porovnani` - Comparison view
- `/rekapitulace` - Summary/recap
- `/vysledek` - Results page
- `/vysledek/[publicId]` - Public shared results

### Embed Routes

Same structure under `app/(embed)/embed/[embed]/`:
- `(one-segment)/[first]/`
- `(two-segments)/[first]/[second]/`
- `(three-segments)/[first]/[second]/[third]/`

All with the same validation and param mapping logic.

### Current Redirects (next.config.ts)

Redirects remain unchanged to maintain backward compatibility:
```typescript
{
  source: "/volby/snemovni-2025",
  destination: "/volby/snemovni-2025/kalkulacka",
  permanent: false,
}
// Plus archive redirects for 2024, 2023, 2022 elections
```

## Benefits Achieved

✅ **Flexible URL structure** - Support for standalone, grouped, and prefixed calculators
✅ **Type-safe routing** - Each pattern has proper TypeScript types
✅ **Validated prefixes** - Only allowed prefixes accepted, others return 404
✅ **Clean data layer** - Prefix is validated but not passed to `loadCalculatorData`
✅ **Backward compatible** - Existing `/volby/*` URLs still work
✅ **Framework optimizations preserved** - Static generation, caching, etc.

## Design Decisions Made

1. **Prefix validation** - Only "volby" initially allowed, easy to extend
2. **Two-segment root** - Redirects to introduction instead of custom landing page
3. **Smart param mapping** - Maps from end backwards for flexibility
4. **Guard pattern** - `prefixGuard()` returns 404 for invalid prefixes
5. **Shared components** - All route patterns use same calculator components

## Files Modified/Created

- `app/(web)/(app)/(one-segment)/[first]/` - All calculator routes
- `app/(web)/(app)/(two-segments)/[first]/[second]/` - All calculator routes
- `app/(web)/(app)/(three-segments)/[first]/[second]/[third]/` - All calculator routes
- `app/(embed)/embed/[embed]/(one-segment)/[first]/` - Embed routes
- `app/(embed)/embed/[embed]/(two-segments)/[first]/[second]/` - Embed routes
- `app/(embed)/embed/[embed]/(three-segments)/[first]/[second]/[third]/` - Embed routes
- `lib/routing/validators/prefix.ts` - Prefix validation
- `lib/routing/guards/prefix.ts` - Prefix guard (404 on invalid)
- `lib/routing/params-mapper.ts` - Smart parameter extraction
- Updated URL builders and route helpers

## Future Enhancements

To add more prefixes, simply update:
```typescript
// lib/routing/validators/prefix.ts
export const PREFIXES = ["volby", "inventura", "new-prefix"];
```

No other code changes required - the system is fully flexible!
