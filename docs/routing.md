# Routing Architecture

This document describes the flexible routing system for the Kalkulačka.1 platform, which supports multiple URL patterns for different calculator types.

## Overview

The routing system supports 1, 2, and 3 segment URL patterns. Route segments are mapped **backwards**:
- Last segment = calculator key
- Second-to-last segment = group key (if present)
- First segment = prefix (validated but not passed to data layer)

## URL Patterns & Requirements

### 1. One-Segment Routes
**Pattern:** `/{calculator-key}`

**Example:** `/sametova-kalkulacka`

**Behavior:**
- No prefix validation
- Data loading: `key: first` (no group)
- Root redirects to introduction: `/{calculator-key}/uvod`

**Use cases:**
- Standalone calculators
- Simple calculators without grouping

---

### 2. Two-Segment Routes
**Pattern:** `/{prefix}/{calculator-key}` OR `/{group}/{calculator-key}`

**Examples:**
- `/volby/snemovni-2025` (prefixed)
- `/inventura-2025/expresni` (group calculator)

**Behavior:**
- **If `first` is in `ALLOWED_PREFIXES`:**
  - Validates prefix (404 on invalid)
  - Data loading: `key: second` (no group)
  - Root shows election landing page (TODO)
  - Currently redirects to: `/{prefix}/{calculator-key}/uvod`

- **If `first` is NOT in `ALLOWED_PREFIXES`:**
  - No prefix validation
  - Data loading: `key: first, group: second`
  - Root redirects to: `/{group}/{calculator-key}/uvod`

**Use cases:**
- Election landing pages with calculator (e.g., `/volby/snemovni-2025`)
- Group calculators (e.g., `/inventura-2025/expresni`)

---

### 3. Three-Segment Routes
**Pattern:** `/{prefix}/{calculator-key}/{group}`

**Example:** `/volby/krajske-2026/moravskoslezsky`

**Behavior:**
- Validates prefix (404 on invalid)
- Data loading: `key: second, group: third`
- Root redirects to: `/{prefix}/{calculator-key}/{group}/uvod`

**Use cases:**
- Namespaced calculators with grouping
- Regional/district-specific calculators

---

## Allowed Prefixes

Prefixes that trigger validation in multi-segment routes:

```typescript
export const ALLOWED_PREFIXES = ["volby", "inventura"];
```

- `volby` - Elections
- `inventura` - Inventory/audits

---

## Route Structure

All calculator routes include these subroutes:
- `/uvod` - Introduction
- `/navod` - Guide/instructions
- `/otazka/[number]` - Question pages
- `/rekapitulace` - Review/summary
- `/vysledek` - Results
- `/vysledek/[publicId]` - Public results
- `/porovnani` - Comparison

---

## Implementation Details

### File Structure
```
app/(web)/(app)/
├── (one-segment)/
│   └── [first]/
│       ├── layout.tsx       # Loads: key=first
│       ├── page.tsx         # Redirects to introduction
│       ├── uvod/
│       ├── navod/
│       ├── otazka/[questionNumber]/
│       ├── rekapitulace/
│       ├── vysledek/
│       └── porovnani/
├── (two-segments)/
│   └── [first]/[second]/
│       ├── layout.tsx       # Validates prefix, loads: key=second OR key=first,group=second
│       ├── page.tsx         # Landing page or redirect to introduction
│       └── [subroutes...]
└── (three-segments)/
    └── [first]/[second]/[third]/
        ├── layout.tsx       # Validates prefix, loads: key=second,group=third
        ├── page.tsx         # Redirects to introduction
        └── [subroutes...]
```

### Data Loading

Layouts load calculator data using the backwards mapping:

```typescript
// One-segment
loadCalculatorData({ key: first })

// Two-segments (prefixed)
loadCalculatorData({ key: second })

// Two-segments (non-prefixed) - TODO: Not yet implemented
loadCalculatorData({ key: first, group: second })

// Three-segments
loadCalculatorData({ key: second, group: third })
```

### Prefix Validation

The `allowedPrefixGuard` function handles prefix validation:

```typescript
// Validates and returns 404 if invalid
allowedPrefixGuard(first);
```

Follows the guard/validator pattern:
- `validators/allowed-prefix.ts` - Throws on invalid prefix
- `guards/allowed-prefix.ts` - Calls `notFound()` on validation failure

---

## Current Status & TODOs

### ✅ Implemented
- One-segment routes (standalone calculators)
- Three-segment routes (prefixed with groups)
- Prefix validation system
- Route builders supporting all patterns
- Guard/validator pattern for prefix checking

### ⚠️ Partially Implemented
- Two-segment routes currently only support prefixed pattern
- Need conditional logic to support both prefixed and non-prefixed

### 📋 TODOs
1. **Two-segment conditional logic:**
   - Check if `first` is in `ALLOWED_PREFIXES`
   - If yes: validate prefix, load `key: second`
   - If no: skip validation, load `key: first, group: second`

2. **Election landing page:**
   - Replace redirect with actual landing page content
   - Show election information, calculator list, etc.

3. **Testing:**
   - Verify all route patterns work correctly
   - Test prefix validation (valid/invalid prefixes)
   - Test data loading for each pattern

---

## Examples

### Working Examples

```
✅ /sametova-kalkulacka
   → key: "sametova-kalkulacka"

✅ /volby/snemovni-2025
   → prefix: "volby" (validated)
   → key: "snemovni-2025"

✅ /volby/krajske-2026/moravskoslezsky
   → prefix: "volby" (validated)
   → key: "krajske-2026"
   → group: "moravskoslezsky"
```

### Not Yet Working

```
❌ /inventura-2025/expresni
   → Should be: key: "inventura-2025", group: "expresni"
   → Currently: Tries to validate "inventura-2025" as prefix → 404
```
