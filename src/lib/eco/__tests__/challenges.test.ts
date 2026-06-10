import { describe, it, expect } from "vitest";
import { CHALLENGES, BADGES } from "../challenges";

describe("challenges catalog", () => {
  it("ships at least 6 challenges with unique ids", () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(6);
    const ids = new Set(CHALLENGES.map((c) => c.id));
    expect(ids.size).toBe(CHALLENGES.length);
  });

  it("every challenge awards positive XP and a positive duration", () => {
    for (const c of CHALLENGES) {
      expect(c.xp).toBeGreaterThan(0);
      expect(c.durationDays).toBeGreaterThan(0);
    }
  });

  it("badge thresholds are monotonically increasing", () => {
    for (let i = 1; i < BADGES.length; i++) {
      expect(BADGES[i].threshold).toBeGreaterThan(BADGES[i - 1].threshold);
    }
  });

  it("badges unlock in order as completed-count grows", () => {
    const unlockedAt = (n: number) => BADGES.filter((b) => n >= b.threshold).length;
    expect(unlockedAt(0)).toBe(0);
    expect(unlockedAt(1)).toBe(1);
    expect(unlockedAt(3)).toBe(2);
    expect(unlockedAt(5)).toBe(3);
    expect(unlockedAt(6)).toBe(BADGES.length);
  });
});