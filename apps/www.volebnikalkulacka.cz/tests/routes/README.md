# Routing Tests

This directory contains comprehensive integration tests for the Kalkulacka.1 routing implementation. These tests serve as both **regression tests** and **documentation** of expected routing behavior before refactoring to remove the hardcoded `/volby` prefix.

## Overview

The tests verify the current routing implementation in `apps/www.volebnikalkulacka.cz`, which supports:

- **One-segment routes**: `/volby/[first]/` (e.g., `/volby/snemovni-2025/kalkulacka`)
- **Two-segment routes**: `/volby/[first]/[second]/` (e.g., `/volby/krajske-2024/jihomoravsky`)
- **Embed routes**: `/embed/[embed]/volby/...` (same structure as above, but embedded)
- **Public result routes**: `/volby/.../vysledek/[publicId]` (shareable results)

## Test Files

### `route-builders.test.ts`

Tests the route builder functions that generate route paths.

**Coverage:**
- `createBaseSegment()` - Creates base route segments
- `routes.introduction()` - Introduction page routes
- `routes.guide()` - Guide/instructions page routes
- `routes.question()` - Question page routes with question numbers
- `routes.review()` - Review/recap page routes
- `routes.result()` - Results page routes
- `routes.publicResult()` - Public shareable results routes
- `routes.comparison()` - Comparison page routes

**Patterns tested:**
- One-segment routes (e.g., `/volby/snemovni-2025/uvod`)
- Two-segment routes (e.g., `/volby/krajske-2024/jihomoravsky/uvod`)
- Embed one-segment routes (e.g., `/embed/test/volby/snemovni-2025/uvod`)
- Embed two-segment routes (e.g., `/embed/test/volby/krajske-2024/jihomoravsky/uvod`)

### `route-validators.test.ts`

Tests route parameter validation logic.

**Coverage:**
- `validateQuestionNumber()` - Validates question number parameters
  - Accepts: Positive integers as strings
  - Rejects: Non-numeric, zero, negative, decimal, empty, special values

### `redirects.test.ts`

Tests the redirect configuration from `next.config.ts`.

**Coverage:**
- Current election redirects (temporary 307)
- Methodology and privacy page redirects (permanent 301)
- 2024 archive redirects to `archiv-2024.volebnikalkulacka.cz`
- 2022-2023 archive redirects to `archiv.volebnikalkulacka.cz`

**Note:** These tests verify the redirect *configuration*, not actual HTTP redirects. For E2E redirect testing, use Playwright.

### `data-loading.test.ts`

Tests calculator data loading for different route types.

**Coverage:**
- One-segment route data loading (key parameter only)
- Two-segment route data loading (key + group parameters)
- Base URL construction
- Required vs optional data file handling
- Error handling for missing data

### `routing-structure.test.ts`

Tests that verify the expected file structure exists.

**Coverage:**
- One-segment route file structure
- Two-segment route file structure
- Public result route structure
- Embed route structure
- Consistency between patterns

**Purpose:** These tests document the expected routing structure and will fail if route files are moved or deleted during refactoring.

### `error-handling.test.ts`

Tests error handling and validation.

**Coverage:**
- Invalid question number handling
- Route parameter validation patterns
- Documentation of Next.js error handling behavior:
  - Automatic 404 for non-existent routes
  - `notFound()` called by guards
  - Error boundaries for data loading failures

## Mock Data

### `../fixtures/mock-calculator-data.ts`

Provides mock calculator data for testing.

**Exports:**
- `mockOneSegmentCalculatorData` - Mock data for one-segment routes
- `mockTwoSegmentCalculatorData` - Mock data for two-segment routes
- `getMockCalculatorData()` - Helper to get appropriate mock data
- `MOCK_PUBLIC_ID` - Mock public ID for result sharing tests
- `MOCK_EMBED_NAME` - Mock embed name for embed route tests

## Running Tests

```bash
# Run all routing tests
npm run test tests/routes

# Run specific test file
npm run test tests/routes/route-builders.test.ts

# Run tests in watch mode
npm run test:ui
```

## Test Approach

These tests use **Vitest** with **jsdom** for fast, focused integration testing:

1. **Route Builders** - Test route generation logic directly
2. **Validators** - Test parameter validation logic
3. **Data Loading** - Test with mocked fetch/parse functions
4. **Redirects** - Test configuration structure
5. **File Structure** - Verify expected files exist

For **E2E testing** (actual HTTP requests, rendering, user interactions), use the Playwright tests in `tests/e2e/`.

## Coverage

✅ All one-segment routes
✅ All two-segment routes
✅ All embed routes
✅ Public result routes
✅ Redirect configuration
✅ Calculator data loading
✅ Error handling and validation
✅ Route builder functions
✅ File structure verification

## Future Work

When refactoring to remove the hardcoded `/volby` prefix:

1. Update `route-builders.test.ts` to test new route structure
2. Update `redirects.test.ts` if redirect rules change
3. Update `routing-structure.test.ts` to reflect new file structure
4. Ensure all tests continue to pass after refactoring
5. Add E2E Playwright tests for critical user flows

## Notes

- These tests focus on **behavior** not implementation details
- Tests are designed to be **readable** and serve as documentation
- Mock data matches real data structure from `@repo/schema`
- Tests are **deterministic** and don't rely on external data sources
- File structure tests prevent accidental breaking changes during refactoring
