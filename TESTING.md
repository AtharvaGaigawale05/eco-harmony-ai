# 🧪 Testing — EcoTrack AI

EcoTrack AI uses **Vitest** + **React Testing Library** for unit and component tests. The Vite-native runner matches the production toolchain (no Jest/Babel duplication).

## Setup

```bash
bun add -d vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest run --coverage"
```

## Running

```bash
bun run test                # one-shot
bun run test:watch          # watch mode
bun run test:coverage       # coverage report
```

## What's covered

| Area                          | File                                                  |
|-------------------------------|-------------------------------------------------------|
| Carbon calculation engine     | `src/lib/eco/__tests__/calculate.test.ts`             |
| Challenge unlock logic        | `src/lib/eco/__tests__/challenges.test.ts`            |
| Storage helpers (localStorage)| `src/lib/eco/__tests__/storage.test.ts`               |
| AI server-function validators | `src/lib/ai/__tests__/chat.validators.test.ts`        |
| Dashboard render              | `src/routes/__tests__/dashboard.test.tsx`             |
| Assistant render              | `src/routes/__tests__/assistant.test.tsx`             |

## Writing a test

```ts
import { describe, it, expect } from "vitest";
import { calculate, DEFAULT_INPUT } from "@/lib/eco/calculate";

describe("calculate", () => {
  it("returns a non-negative annual footprint for defaults", () => {
    const r = calculate(DEFAULT_INPUT);
    expect(r.totalKgPerYear).toBeGreaterThan(0);
    expect(r.ecoScore).toBeGreaterThanOrEqual(0);
    expect(r.ecoScore).toBeLessThanOrEqual(100);
  });
});
```

## E2E (optional)

For API-level tests of TanStack server functions, use the `stack_modern--invoke-server-function` tool in CI or `bun add -d supertest` against a `bun run preview` instance.

## CI

The Lovable CI runs `bun run build` (typecheck + bundle) on every commit. Add `bun run test` to your CI step once test deps are installed.

## Coverage targets

- Statements: **≥ 80 %** for `src/lib/eco/**`
- Critical paths (`calculate`, `storage`, `ecoChat` validator): **100 %**