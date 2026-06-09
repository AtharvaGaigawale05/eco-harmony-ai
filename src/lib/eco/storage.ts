import type { CalculatorInput, HistoryEntry } from "./types";

const HISTORY_KEY = "ecotrack:history:v1";
const CHALLENGES_KEY = "ecotrack:challenges:v1";
const INPUT_KEY = "ecotrack:input:v1";

function safeWindow(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

export function loadHistory(): HistoryEntry[] {
  const ls = safeWindow();
  if (!ls) return [];
  try {
    const raw = ls.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch { return []; }
}

export function saveHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const ls = safeWindow();
  const list = [entry, ...loadHistory()].slice(0, 50);
  if (ls) ls.setItem(HISTORY_KEY, JSON.stringify(list));
  return list;
}

export function loadInput(): CalculatorInput | null {
  const ls = safeWindow();
  if (!ls) return null;
  try {
    const raw = ls.getItem(INPUT_KEY);
    return raw ? (JSON.parse(raw) as CalculatorInput) : null;
  } catch { return null; }
}

export function saveInput(input: CalculatorInput) {
  const ls = safeWindow();
  if (ls) ls.setItem(INPUT_KEY, JSON.stringify(input));
}

export type ChallengeState = Record<string, { completed: boolean; progress: number }>;

export function loadChallenges(): ChallengeState {
  const ls = safeWindow();
  if (!ls) return {};
  try {
    const raw = ls.getItem(CHALLENGES_KEY);
    return raw ? (JSON.parse(raw) as ChallengeState) : {};
  } catch { return {}; }
}

export function saveChallenges(state: ChallengeState) {
  const ls = safeWindow();
  if (ls) ls.setItem(CHALLENGES_KEY, JSON.stringify(state));
}