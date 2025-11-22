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

**Pattern**: `/{key}`

**Example**: `/green-deal`

- No validation
- Params mapping: `key: first` (standalone calculator)

### 2. Two-segment routes

**Pattern**: `/{prefix}/{key}` or `/{group}/{key}`

**Example**: `/election/presidential-2028` or `/energy/solar`

If `first` is in allowed prefixes:

- Params mapping: `key: second` (standalone calculator)

If `first` is not in allowed prefixes:

- Params mapping: `group: first, key: second`

### 3. Three-segment routes

**Pattern**: `/{prefix}/{group}/{key}`

**Example**: `/election/senate-2026/prague`

- Prefix validation
- Params mapping: `group: second, key: third`

## Subroutes

All calculator routes include these subroutes:

- Root `/` redirects to `/introduction`
- `/introduction`
- `/guide`
- `/question` redirects to `/question/1`
- `/question/[questionNumber]`
- `/review`
- `/result`
- `/comparison`
- + `/result/[publicId]`

## Embeds

All route patterns are also available as embeds with the prefix `/embed/[embed]`.

**Pattern**: `/embed/{embed name}/…`

**Examples**:

- `/embed/bbc/green-deal`
- `/embed/bbc/election/presidential-2028`
- `/embed/bbc/election/senate-2026/prague`

Embed name is validated, all embed subroutes follow the same data loading logic as their non-embed counterparts.
