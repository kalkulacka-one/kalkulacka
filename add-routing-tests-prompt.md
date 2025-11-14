# Add Comprehensive Routing Tests for Current Implementation

## Overview

Create comprehensive integration tests for the existing routing implementation in `apps/www.volebnikalkulacka.cz` to verify all routes work correctly before refactoring. Tests should be clear, readable, and serve as documentation of expected routing behavior.

## Current Routes to Test

### Route Structures

**One-segment routes:** `/volby/[first]/`
- Example: `/volby/snemovni-2025/kalkulacka`

**Two-segment routes:** `/volby/[first]/[second]/`
- Example: `/volby/krajske-2024/jihomoravsky`

**Both patterns support these subroutes:**
- `/` - Calculator intro page
- `/uvod` - Introduction
- `/navod` - Instructions/guide
- `/otazka` - Questions redirect
- `/otazka/[questionNumber]` - Specific question (e.g., `/otazka/1`, `/otazka/2`)
- `/porovnani` - Comparison view
- `/rekapitulace` - Summary/recap
- `/vysledek` - Results page
- `/vysledek/[publicId]` - Public shared results

**Embed routes:** Same structure under `/embed/[embed]/volby/...`

## Mock Data Structure

Create mock calculator data based on the real data structure from `http://data.kalkulacka.one/www.volebnikalkulacka.cz/snemovni-2025/expresni/calculator.json` (if accessible) or use the schema from `loadCalculatorData`:

```typescript
const mockCalculatorData = {
  data: {
    calculator: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Sněmovní volby 2025",
      description: "Volební kalkulačka pro sněmovní volby 2025",
      publishedAt: "2024-01-15T10:30:00Z",
      // ... other calculator fields
    },
    questions: {
      questions: [
        {
          id: "q1",
          title: "Question 1 title",
          description: "Question 1 description",
          // ... other question fields
        },
        {
          id: "q2",
          title: "Question 2 title",
          description: "Question 2 description",
          // ... other question fields
        },
        // Add at least 5 questions for realistic testing
      ],
    },
    candidates: {
      candidates: [
        {
          id: "c1",
          name: "Candidate 1",
          // ... other candidate fields
        },
        // ... other candidates
      ],
    },
    candidatesAnswers: {
      answers: [
        // ... candidate answers
      ],
    },
    persons: {
      persons: [
        // ... optional persons data
      ],
    },
    organizations: {
      organizations: [
        // ... optional organizations data
      ],
    },
  },
  baseUrl: "https://data.kalkulacka.one/snemovni-2025/expresni",
};
```

## Test Requirements

### 1. Route Accessibility Tests

Test that all routes return 200 status (or appropriate status) and render without errors:

**One-segment pattern** (e.g., `/volby/snemovni-2025/kalkulacka`):
```typescript
describe("One-segment routes: /volby/[first]", () => {
  const baseRoute = "/volby/snemovni-2025/kalkulacka";

  it("should render calculator intro page", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka
  });

  it("should render introduction page (/uvod)", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka/uvod
  });

  it("should render instructions page (/navod)", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka/navod
  });

  it("should render question pages (/otazka/1, /otazka/2, etc.)", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka/otazka/1
    // Test GET /volby/snemovni-2025/kalkulacka/otazka/2
  });

  it("should render comparison page (/porovnani)", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka/porovnani
  });

  it("should render recap page (/rekapitulace)", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka/rekapitulace
  });

  it("should render results page (/vysledek)", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka/vysledek
  });

  it("should render public shared results (/vysledek/[publicId])", async () => {
    // Test GET /volby/snemovni-2025/kalkulacka/vysledek/abc123
  });
});
```

**Two-segment pattern** (e.g., `/volby/krajske-2024/jihomoravsky`):
```typescript
describe("Two-segment routes: /volby/[first]/[second]", () => {
  const baseRoute = "/volby/krajske-2024/jihomoravsky";

  it("should render calculator intro page", async () => {
    // Test GET /volby/krajske-2024/jihomoravsky
  });

  it("should render introduction page (/uvod)", async () => {
    // Test GET /volby/krajske-2024/jihomoravsky/uvod
  });

  // ... same subroutes as one-segment
});
```

### 2. Embed Routes Tests

Test embed routes work identically to regular routes:

```typescript
describe("Embed routes: /embed/[embed]/volby/...", () => {
  const embedName = "test-embed";

  describe("One-segment embed routes", () => {
    const baseRoute = `/embed/${embedName}/volby/snemovni-2025/kalkulacka`;

    it("should render calculator intro page", async () => {
      // Test embed route works
    });

    // ... test all subroutes
  });

  describe("Two-segment embed routes", () => {
    const baseRoute = `/embed/${embedName}/volby/krajske-2024/jihomoravsky`;

    it("should render calculator intro page", async () => {
      // Test embed route works
    });

    // ... test all subroutes
  });
});
```

### 3. Redirects Tests

Test redirects defined in `next.config.ts`:

```typescript
describe("Redirects from next.config.ts", () => {
  it("should redirect /volby/snemovni-2025 to /volby/snemovni-2025/kalkulacka", async () => {
    // Test 307/308 redirect
  });

  it("should permanently redirect /metodika-tvorby-otazek to /metodika", async () => {
    // Test 301 redirect
  });

  it("should permanently redirect /ochrana-dat to /soukromi", async () => {
    // Test 301 redirect
  });

  it("should redirect 2024 archive routes to archiv-2024 subdomain", async () => {
    // Test /volby/krajske-2024/* redirects
    // Test /volby/senatni-2024/* redirects
    // Test /volby/evropske-2024/* redirects
  });

  it("should redirect 2022-2023 archive routes to archiv subdomain", async () => {
    // Test /volby/prezidentske-2023/* redirects
    // Test /volby/senatni-2022/* redirects
    // Test /volby/komunalni-2022/* redirects
  });
});
```

### 4. Data Loading Tests

Test that routes correctly load calculator data:

```typescript
describe("Calculator data loading", () => {
  it("should load one-segment calculator with only key param", async () => {
    // Verify loadCalculatorData({ key: "snemovni-2025" }) is called
  });

  it("should load two-segment calculator with key and group params", async () => {
    // Verify loadCalculatorData({ key: "krajske-2024", group: "jihomoravsky" }) is called
  });
});
```

### 5. Error Handling Tests

Test error cases:

```typescript
describe("Error handling", () => {
  it("should return 404 for non-existent routes", async () => {
    // Test /volby/non-existent-election
  });

  it("should return 404 for invalid question numbers", async () => {
    // Test /volby/snemovni-2025/kalkulacka/otazka/999
  });

  it("should handle missing calculator data gracefully", async () => {
    // Mock loadCalculatorData to fail
  });
});
```

## Test Organization

Organize tests in a human-readable structure:

```
apps/www.volebnikalkulacka.cz/
  tests/
    routes/
      one-segment.test.ts       # One-segment route tests
      two-segments.test.ts      # Two-segment route tests
      embed.test.ts             # Embed route tests
      redirects.test.ts         # Redirect tests
      data-loading.test.ts      # Data loading verification
      error-handling.test.ts    # Error cases
    fixtures/
      mock-calculator-data.ts   # Shared mock data
```

## Test Implementation Guidelines

1. **Use descriptive test names** that clearly state what's being tested
2. **Mock `loadCalculatorData`** to return consistent test data
3. **Group related tests** using `describe` blocks
4. **Test both success and failure cases**
5. **Verify response status codes** (200, 301, 307, 404, etc.)
6. **Check rendered content** contains expected elements (titles, questions, etc.)
7. **Use test fixtures** for reusable mock data
8. **Add comments** explaining non-obvious test logic

## Testing Approach

Use one of these approaches:

**Option A: Integration tests with Next.js test utilities**
- Use `@testing-library/react` for rendering
- Mock Next.js routing with `next-router-mock`
- Mock data fetching functions

**Option B: E2E tests with Playwright** (if Playwright is already set up)
- Start dev server
- Navigate to routes
- Verify page content

**Recommended:** Start with **Option A** (integration tests) for faster feedback, as the project already uses Vitest with jsdom.

## Success Criteria

- ✅ All one-segment routes render successfully
- ✅ All two-segment routes render successfully
- ✅ All embed routes work correctly
- ✅ All redirects work as configured
- ✅ Calculator data loads with correct parameters
- ✅ Error cases return appropriate status codes
- ✅ Tests are readable and serve as documentation
- ✅ Mock data matches real data structure
- ✅ All tests pass: `npm run test`

## Implementation Checklist

1. Create mock calculator data fixtures matching real data structure
2. Set up test utilities for route testing
3. Write one-segment route tests
4. Write two-segment route tests
5. Write embed route tests
6. Write redirect tests
7. Write data loading tests
8. Write error handling tests
9. Ensure all tests pass
10. Run `npm run typecheck` and `npm run lint:fix`

## Notes

- These tests will serve as **regression tests** during the refactoring to remove hardcoded `/volby` prefix
- Tests should be **comprehensive** but **maintainable** - focus on behavior, not implementation details
- Use **snapshot testing sparingly** - prefer explicit assertions about critical content
- Mock external data sources to make tests fast and deterministic
