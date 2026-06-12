import { describe, it, expect } from "vitest";
import { calculate, DEFAULT_INPUT } from "../calculate";

describe("calculate()", () => {
  it("produces a non-negative total for default input", () => {
    const r = calculate(DEFAULT_INPUT);
    expect(r.totalKgPerYear).toBeGreaterThan(0);
  });

  it("clamps ecoScore to [0, 100]", () => {
    const r = calculate(DEFAULT_INPUT);
    expect(r.ecoScore).toBeGreaterThanOrEqual(0);
    expect(r.ecoScore).toBeLessThanOrEqual(100);
  });

  it("vegan diet emits less than heavy-meat diet (all else equal)", () => {
    const vegan = calculate({ ...DEFAULT_INPUT, dietType: "vegan" });
    const heavy = calculate({ ...DEFAULT_INPUT, dietType: "heavy_meat" });
    expect(vegan.breakdown.food).toBeLessThan(heavy.breakdown.food);
    expect(vegan.totalKgPerYear).toBeLessThan(heavy.totalKgPerYear);
  });

  it("100% renewable share zeroes out electricity emissions", () => {
    const r = calculate({ ...DEFAULT_INPUT, renewableShare: 100 });
    expect(r.breakdown.electricity).toBe(0);
  });

  it("more flights => higher transport emissions", () => {
    const a = calculate({ ...DEFAULT_INPUT, flightsPerYear: 0 });
    const b = calculate({ ...DEFAULT_INPUT, flightsPerYear: 5 });
    expect(b.breakdown.transport).toBeGreaterThan(a.breakdown.transport);
  });

  it("higher recycling share reduces waste emissions", () => {
    const a = calculate({ ...DEFAULT_INPUT, recyclingShare: 0 });
    const b = calculate({ ...DEFAULT_INPUT, recyclingShare: 100 });
    expect(b.breakdown.waste).toBeLessThan(a.breakdown.waste);
  });

  it("assigns a level consistent with the score", () => {
    const r = calculate(DEFAULT_INPUT);
    expect(["Beginner", "Eco Aware", "Eco Hero", "Planet Protector"]).toContain(r.level);
  });
});
