# Routing

This document describes the flexible routing system for Next.js-based voting advice applications, which support multiple path patterns for different calculator types.

## Overview

The routing system supports 1, 2, and 3 segment path patterns. Route segments are mapped backwards:

- Last segment = calculator key
- Second-to-last segment = group key (if present)
- First segment = prefix (validated but not passed to data layer)

This means it is possible to use nice, human-friendly paths like:

- `/green-deal`
- `/energy/solar`
- `/election/presidential-2028`
- `/election/senate-2026/prague`

## Path patterns

### 1. One-segment routes

**Pattern**: `/{calculatorKey}`

**Example**: `/green-deal`

**Params**: `{ first: string }`

**Behavior**:
- No validation
- Data loading: `key: first` (standalone calculator)

**Redirects**:
- Root: `/{calculatorKey}` → `/{calculatorKey}/uvod`
- Question: `/{calculatorKey}/otazka` → `/{calculatorKey}/otazka/1`

### 2. Two-segment routes

**Pattern**: `/{prefix}/{calculatorKey}` or `/{groupKey}/{calculatorKey}`

**Examples**:
- `/election/presidential-2028` (prefixed)
- `/energy/solar` (grouped)

**Params**: `{ first: string, second: string }`

**Behavior - If `first` is in allowed prefixes**:
- Data loading: `key: second` (standalone calculator)

**Behavior - If `first` is NOT in allowed prefixes**:
- Data loading: `group: first, key: second` (grouped calculator)

**Redirects**:
- Root: `/{first}/{second}` → `/{first}/{second}/uvod`
- Question: `/{first}/{second}/otazka` → `/{first}/{second}/otazka/1`

### 3. Three-segment routes

**Pattern**: `/{prefix}/{groupKey}/{calculatorKey}`

**Example**: `/election/senate-2026/prague`

**Params**: `{ first: string, second: string, third: string }`

**Behavior**:
- Prefix validation (404 on invalid prefix)
- Data loading: `group: second, key: third`

**Redirects**:
- Root: `/{first}/{second}/{third}` → `/{first}/{second}/{third}/uvod`
- Question: `/{first}/{second}/{third}/otazka` → `/{first}/{second}/{third}/otazka/1`

## Subroutes

All calculator routes include these subroutes:

- `/uvod` - Introduction page
- `/navod` - Guide page
- `/otazka` - Question redirect (→ `/otazka/1`)
- `/otazka/[questionNumber]` - Individual question page (params: `{ questionNumber: string }`)
- `/rekapitulace` - Review page
- `/vysledek` - Result page
- `/porovnani` - Comparison page
- `/vysledek/[publicId]` - Public result page (params: `{ publicId: string }`)

## Embeds

All route patterns are also available as embeds with the prefix `/embed/[embed]`.

**Pattern**: `/embed/{embedType}/{...calculator-path}`

**Examples**:
- `/embed/simple/green-deal` (one-segment, params: `{ embed: string, first: string }`)
- `/embed/simple/election/presidential-2028` (two-segment, params: `{ embed: string, first: string, second: string }`)
- `/embed/simple/election/senate-2026/prague` (three-segment, params: `{ embed: string, first: string, second: string, third: string }`)

Embed routes follow the same data loading logic as their non-embed counterparts:
- Use the same layouts (re-exported)
- Use the same metadata generation helpers
- Include all the same subroutes and redirects
- Pass the `embed` parameter to components via segments

The `embed` parameter is used by the UI to customize the presentation (e.g., hiding navigation, adjusting styling for iframe embedding).
