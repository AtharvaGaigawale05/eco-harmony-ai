import { describe, it, expect, beforeEach } from "vitest";
import {
  loadHistory,
  saveHistoryEntry,
  loadInput,
  saveInput,
  loadChallenges,
  saveChallenges,
} from "../storage";
import { calculate, DEFAULT_INPUT } from "../calculate";

beforeEach(() => {
  // jsdom provides window.localStorage
  window.localStorage.clear();
});

describe("storage", () => {
  it("returns [] when no history is stored", () => {
    expect(loadHistory()).toEqual([]);
  });

  it("persists and prepends history entries (newest first)", () => {
    const r1 = { ...calculate(DEFAULT_INPUT), id: "1", input: DEFAULT_INPUT };
    const r2 = { ...calculate(DEFAULT_INPUT), id: "2", input: DEFAULT_INPUT };
    saveHistoryEntry(r1);
    const list = saveHistoryEntry(r2);
    expect(list[0].id).toBe("2");
    expect(list[1].id).toBe("1");
    expect(loadHistory()).toHaveLength(2);
  });

  it("caps history at 50 entries", () => {
    for (let i = 0; i < 60; i++) {
      saveHistoryEntry({ ...calculate(DEFAULT_INPUT), id: String(i), input: DEFAULT_INPUT });
    }
    expect(loadHistory()).toHaveLength(50);
  });

  it("round-trips calculator input", () => {
    expect(loadInput()).toBeNull();
    saveInput(DEFAULT_INPUT);
    expect(loadInput()).toEqual(DEFAULT_INPUT);
  });

  it("round-trips challenge state", () => {
    expect(loadChallenges()).toEqual({});
    saveChallenges({ "bike-to-work": { completed: true, progress: 100 } });
    expect(loadChallenges()["bike-to-work"].completed).toBe(true);
  });

  it("recovers from corrupt JSON without throwing", () => {
    window.localStorage.setItem("ecotrack:history:v1", "{not json");
    expect(loadHistory()).toEqual([]);
  });
});
