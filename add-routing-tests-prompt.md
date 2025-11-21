# Add Comprehensive Routing Tests for Current Implementation

## Overview

Create comprehensive integration tests for the existing routing implementation in `apps/www.volebnikalkulacka.cz` to verify all routes work correctly. Tests should be clear, readable, and serve as documentation of expected routing behavior.

## Current Routing Implementation

The app now has **flexible routing without hardcoded `/volby` prefix**:

### Route Structures

**One-segment routes:** `/[first]/`
- Example: `/sametova-kalkulacka`
- No prefix validation
- Direct calculator access

**Two-segment routes:** `/[first]/[second]/`
- Examples:
  - `/volby/snemovni-2025` (prefix + election)
  - `/inventura-2025/expresni` (group + calculator)
- Validates first segment if it's in `PREFIXES` list
- Root redirects to `/uvod`

**Three-segment routes:** `/[first]/[second]/[third]/`
- Example: `/volby/krajske-2026/moravskoslezsky`
- **Always validates first segment** (must be in PREFIXES)
- Prefix + group + calculator

### Parameter Mapping

Segments map **from the end backwards**:
- **Last segment** = calculator key (always)
- **Second-to-last** = group key (if exists and first segment is not a prefix)
- **First segment** = validated prefix (for 2/3-segment routes)

### Allowed Prefixes

Currently only `"volby"` is allowed (defined in `lib/routing/validators/prefix.ts`):
```typescript
export const PREFIXES = ["volby"];
```

Invalid prefixes return **404**.

### All Routes Support These Subroutes:

- `/` - Calculator intro (or redirect to `/uvod` for two-segments)
- `/uvod` - Introduction
- `/navod` - Instructions/guide
- `/otazka` - Questions redirect
- `/otazka/[questionNumber]` - Specific question (e.g., `/otazka/1`, `/otazka/2`)
- `/porovnani` - Comparison view
- `/rekapitulace` - Summary/recap
- `/vysledek` - Results page
- `/vysledek/[publicId]` - Public shared results

### Embed Routes

Same structure under `/embed/[embed]/`:
- `/embed/[embed]/[first]/` (one-segment)
- `/embed/[embed]/[first]/[second]/` (two-segments)
- `/embed/[embed]/[first]/[second]/[third]/` (three-segments)

## Mock Data Structure

Create mock calculator data based on `loadCalculatorData` return type:

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

#### One-segment routes: `/[first]/`

```typescript
describe("One-segment routes: /[first]", () => {
  describe("/sametova-kalkulacka", () => {
    const baseRoute = "/sametova-kalkulacka";

    it("should render calculator intro page", async () => {
      // Test GET /sametova-kalkulacka
      // Verify loadCalculatorData({ key: "sametova-kalkulacka" }) is called
    });

    it("should render introduction page (/uvod)", async () => {
      // Test GET /sametova-kalkulacka/uvod
    });

    it("should render instructions page (/navod)", async () => {
      // Test GET /sametova-kalkulacka/navod
    });

    it("should render question pages (/otazka/1, /otazka/2, etc.)", async () => {
      // Test GET /sametova-kalkulacka/otazka/1
      // Test GET /sametova-kalkulacka/otazka/2
    });

    it("should render comparison page (/porovnani)", async () => {
      // Test GET /sametova-kalkulacka/porovnani
    });

    it("should render recap page (/rekapitulace)", async () => {
      // Test GET /sametova-kalkulacka/rekapitulace
    });

    it("should render results page (/vysledek)", async () => {
      // Test GET /sametova-kalkulacka/vysledek
    });

    it("should render public shared results (/vysledek/[publicId])", async () => {
      // Test GET /sametova-kalkulacka/vysledek/abc123
    });
  });
});
```

#### Two-segment routes: `/[first]/[second]/`

Test both with and without prefix:

```typescript
describe("Two-segment routes: /[first]/[second]", () => {
  describe("With prefix: /volby/snemovni-2025", () => {
    const baseRoute = "/volby/snemovni-2025";

    it("should redirect root to introduction (/uvod)", async () => {
      // Test GET /volby/snemovni-2025
      // Verify it redirects to /volby/snemovni-2025/uvod
      // Verify loadCalculatorData({ key: "snemovni-2025" }) is called
    });

    it("should render introduction page (/uvod)", async () => {
      // Test GET /volby/snemovni-2025/uvod
    });

    it("should render all other subroutes", async () => {
      // Test /navod, /otazka/1, /porovnani, /rekapitulace, /vysledek
    });
  });

  describe("Without prefix: /inventura-2025/expresni", () => {
    const baseRoute = "/inventura-2025/expresni";

    it("should redirect root to introduction (/uvod)", async () => {
      // Test GET /inventura-2025/expresni
      // Verify loadCalculatorData({ key: "expresni", group: "inventura-2025" }) is called
    });

    it("should render all subroutes", async () => {
      // Test all subroutes
    });
  });
});
```

#### Three-segment routes: `/[first]/[second]/[third]/`

```typescript
describe("Three-segment routes: /[first]/[second]/[third]", () => {
  describe("/volby/krajske-2026/moravskoslezsky", () => {
    const baseRoute = "/volby/krajske-2026/moravskoslezsky";

    it("should validate prefix and render calculator intro", async () => {
      // Test GET /volby/krajske-2026/moravskoslezsky
      // Verify loadCalculatorData({ key: "moravskoslezsky", group: "krajske-2026" }) is called
    });

    it("should render all subroutes", async () => {
      // Test /uvod, /navod, /otazka/1, /porovnani, /rekapitulace, /vysledek
    });
  });

  it("should return 404 for invalid prefix", async () => {
    // Test GET /invalid-prefix/krajske-2026/moravskoslezsky
    // Verify 404 response
  });
});
```

### 2. Embed Routes Tests

Test embed routes work identically to regular routes:

```typescript
describe("Embed routes: /embed/[embed]/...", () => {
  const embedName = "test-embed";

  describe("One-segment embed routes", () => {
    it("should render /embed/test-embed/sametova-kalkulacka", async () => {
      // Test embed route works
    });

    it("should render all subroutes", async () => {
      // Test /uvod, /navod, etc.
    });
  });

  describe("Two-segment embed routes", () => {
    it("should render /embed/test-embed/volby/snemovni-2025", async () => {
      // Test embed route works
    });

    it("should render /embed/test-embed/inventura-2025/expresni", async () => {
      // Test non-prefixed embed route
    });
  });

  describe("Three-segment embed routes", () => {
    it("should render /embed/test-embed/volby/krajske-2026/moravskoslezsky", async () => {
      // Test embed route works
    });

    it("should return 404 for invalid prefix in embed", async () => {
      // Test /embed/test-embed/invalid/krajske-2026/moravskoslezsky
    });
  });
});
```

### 3. Prefix Validation Tests

Test that only allowed prefixes work:

```typescript
describe("Prefix validation", () => {
  it("should allow 'volby' prefix", async () => {
    // Test /volby/snemovni-2025 works
  });

  it("should return 404 for invalid prefixes in three-segment routes", async () => {
    // Test /invalid/krajske-2026/moravskoslezsky → 404
  });

  it("should allow non-prefix two-segment routes", async () => {
    // Test /inventura-2025/expresni works
    // "inventura-2025" is not validated as a prefix
  });
});
```

### 4. Parameter Mapping Tests

Test that `loadCalculatorData` receives correct parameters:

```typescript
describe("Parameter mapping (loadCalculatorData calls)", () => {
  it("should map one-segment correctly", async () => {
    // /sametova-kalkulacka
    // Verify: loadCalculatorData({ key: "sametova-kalkulacka" })
  });

  it("should map two-segment with prefix correctly", async () => {
    // /volby/snemovni-2025
    // Verify: loadCalculatorData({ key: "snemovni-2025" })
    // group should be undefined
  });

  it("should map two-segment without prefix correctly", async () => {
    // /inventura-2025/expresni
    // Verify: loadCalculatorData({ key: "expresni", group: "inventura-2025" })
  });

  it("should map three-segment correctly", async () => {
    // /volby/krajske-2026/moravskoslezsky
    // Verify: loadCalculatorData({ key: "moravskoslezsky", group: "krajske-2026" })
  });
});
```

### 5. Redirects Tests

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

### 6. Error Handling Tests

Test error cases:

```typescript
describe("Error handling", () => {
  it("should return 404 for non-existent calculators", async () => {
    // Test /non-existent-calculator
  });

  it("should return 404 for invalid question numbers", async () => {
    // Test /sametova-kalkulacka/otazka/999
  });

  it("should return 404 for invalid three-segment prefixes", async () => {
    // Test /badprefix/krajske-2026/moravskoslezsky
  });

  it("should handle missing calculator data gracefully", async () => {
    // Mock loadCalculatorData to fail
    // Verify appropriate error handling
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
      three-segments.test.ts    # Three-segment route tests
      embed.test.ts             # Embed route tests
      redirects.test.ts         # Redirect tests
      parameter-mapping.test.ts # loadCalculatorData param verification
      prefix-validation.test.ts # Prefix guard tests
      error-handling.test.ts    # Error cases
    fixtures/
      mock-calculator-data.ts   # Shared mock data
```

## Test Implementation Guidelines

1. **Use descriptive test names** that clearly state what's being tested
2. **Mock `loadCalculatorData`** to return consistent test data
3. **Mock prefix validation** if needed (or test against real PREFIXES list)
4. **Group related tests** using `describe` blocks
5. **Test both success and failure cases**
6. **Verify response status codes** (200, 301, 307, 404, etc.)
7. **Check rendered content** contains expected elements (titles, questions, etc.)
8. **Use test fixtures** for reusable mock data
9. **Add comments** explaining non-obvious test logic
10. **Verify `loadCalculatorData` is called with correct params** using spies/mocks

## Testing Approach

Use **integration tests with Next.js test utilities**:
- Use `@testing-library/react` for rendering
- Mock Next.js routing with appropriate test utilities
- Mock `loadCalculatorData` and other data fetching functions
- Test with Vitest (already configured in the project)

The project already has:
- Vitest configured with jsdom environment
- Path aliases set up (`@/` → root)
- React Testing Library available

## Mock Setup Example

```typescript
// tests/fixtures/mock-calculator-data.ts
import { vi } from "vitest";
import type { CalculatorData } from "@/calculator/data-fetching";

export const mockCalculatorData: CalculatorData = {
  data: {
    calculator: {
      id: "test-calculator",
      title: "Test Calculator",
      // ... full mock data
    },
    questions: { questions: [/* ... */] },
    candidates: { candidates: [/* ... */] },
    candidatesAnswers: { answers: [/* ... */] },
  },
  baseUrl: "https://data.kalkulacka.one/test",
};

export function mockLoadCalculatorData() {
  return vi.fn().mockResolvedValue(mockCalculatorData);
}
```

## Success Criteria

- ✅ All one-segment routes render successfully
- ✅ All two-segment routes (with and without prefix) render successfully
- ✅ All three-segment routes render successfully
- ✅ Invalid prefixes return 404
- ✅ All embed routes work correctly
- ✅ All redirects work as configured
- ✅ `loadCalculatorData` receives correct parameters for each route pattern
- ✅ Error cases return appropriate status codes
- ✅ Tests are readable and serve as documentation
- ✅ Mock data matches real data structure
- ✅ All tests pass: `npm run test`

## Implementation Checklist

1. Create mock calculator data fixtures matching real data structure
2. Set up test utilities for route testing
3. Write one-segment route tests
4. Write two-segment route tests (both prefixed and non-prefixed)
5. Write three-segment route tests
6. Write embed route tests
7. Write prefix validation tests
8. Write parameter mapping tests (verify `loadCalculatorData` calls)
9. Write redirect tests
10. Write error handling tests
11. Ensure all tests pass
12. Run `npm run typecheck` and `npm run lint:fix`

## Notes

- These tests document the **current flexible routing implementation**
- Tests verify the backward-mapping param logic (last segment = key, second-to-last = group)
- Tests confirm prefix validation works correctly
- Use **snapshot testing sparingly** - prefer explicit assertions about critical content
- Mock external data sources to make tests fast and deterministic
- Tests should be **comprehensive** but **maintainable**
