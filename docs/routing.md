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
- Data loading: `key: first` (standalone calculator)
- Root redirects to introduction: `/{key}` → `/{key}/introduction`

### 2. Two-segment routes

**Pattern**: `/{prefix}/{key}` or `/{group}/{key}`

**Example**: `/election/presidential-2028` or `/energy/solar`

If `first` is in allowed prefixes:

- Data loading: `key: second` (standalone calculator)
- Root redirects to introduction: `/{prefix}/{key}` → `/{prefix}/{key}/introduction`

If `first` is not in allowed prefixes:

- Data loading: `group: first, key: second`
- Root redirects to introduction: `/{group}/{key}` → `/{group}/{key}/introduction`

### 3. Three-segment routes

**Pattern**: `/{prefix}/{group}/{key}`

**Example**: `/election/senate-2026/prague`

- Prefix validation
- Data loading: `group: second, key: third`
- Root redirects to introduction: `/{prefix}/{group}/{key}` → `/{prefix}/{group}/{key}/introduction`

## Subroutes

All calculator routes include these subroutes:

- `/introduction`
- `/guide`
- `/question/[number]`
- `/review`
- `/result`
- `/comparison`
- + `/result/[publicId]`
