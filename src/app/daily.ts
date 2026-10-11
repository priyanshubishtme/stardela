import type { Difficulty } from "../shared/difficulty";
import {
  colorBinaryPuzzles,
  defaultColorBinaryPuzzle,
  hardColorBinaryPuzzle,
  mediumColorBinaryPuzzle,
  type ColorBinaryPuzzle,
} from "./puzzle-types/color-binary/puzzles";

export const EPOCH_DATE = new Date("2026-01-01T00:00:00Z");
export const DAILY_STORAGE_KEY = "skardela_daily_puzzles";

export interface DailyPuzzleSet {
  dayNumber: number;
  date: string;
  puzzles: {
    easy: string;
    medium: string;
    hard: string;
  };
}

export interface PuzzleAppInfo {
  id: string;
  name: string;
  summary: string;
  isAvailable: boolean;
}

export const puzzleApps: PuzzleAppInfo[] = [
  {
    id: "colour-binary",
    name: "Colour Binary",
    summary: "Make each square red or blue. Each line has half of each colour.",
    isAvailable: true,
  },
  {
    id: "guzzle",
    name: "Guzzle",
    summary:
      "Find four words that cross at one letter. The colors tell you where each letter goes.",
    isAvailable: false,
  },
  {
    id: "lanterns",
    name: "Lanterns",
    summary: "Lit lanterns tell the truth, dark lanterns lie.",
    isAvailable: false,
  },
];

export interface HomeLoaderData {
  dayNumber: number;
  dailyPuzzles: DailyPuzzleSet;
  puzzleApps: PuzzleAppInfo[];
}

export function getDayNumber(date: Date = new Date()): number {
  const diffMs = date.getTime() - EPOCH_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export function getTodayDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0] ?? "2026-10-11";
}

export function getRandomPuzzle(difficulty?: Difficulty): ColorBinaryPuzzle {
  const pool = difficulty
    ? colorBinaryPuzzles.filter((p) => p.difficulty === difficulty)
    : colorBinaryPuzzles;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? defaultColorBinaryPuzzle;
}

export function getStoredDailyPuzzles(): DailyPuzzleSet | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DailyPuzzleSet;
  } catch {
    return null;
  }
}

export function saveDailyPuzzles(data: DailyPuzzleSet): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage might be unavailable
  }
}

function pickRandomPuzzleId(list: ColorBinaryPuzzle[], fallbackId: string): string {
  if (list.length === 0) return fallbackId;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx]?.id ?? fallbackId;
}

export function createDailyPuzzleSet(date: Date = new Date()): DailyPuzzleSet {
  const dayNumber = getDayNumber(date);
  const dateStr = getTodayDateString(date);

  const easyList = colorBinaryPuzzles.filter((p) => p.difficulty === "easy");
  const mediumList = colorBinaryPuzzles.filter((p) => p.difficulty === "medium");
  const hardList = colorBinaryPuzzles.filter((p) => p.difficulty === "hard");

  return {
    dayNumber,
    date: dateStr,
    puzzles: {
      easy: pickRandomPuzzleId(easyList, defaultColorBinaryPuzzle.id),
      medium: pickRandomPuzzleId(mediumList, mediumColorBinaryPuzzle.id),
      hard: pickRandomPuzzleId(hardList, hardColorBinaryPuzzle.id),
    },
  };
}

export function getOrGenerateDailyPuzzles(date: Date = new Date()): DailyPuzzleSet {
  const dayNumber = getDayNumber(date);
  const stored = getStoredDailyPuzzles();
  if (stored && stored.dayNumber === dayNumber) {
    return stored;
  }
  const fresh = createDailyPuzzleSet(date);
  saveDailyPuzzles(fresh);
  return fresh;
}

export function homeLoader(): HomeLoaderData {
  const dailyPuzzles = getOrGenerateDailyPuzzles();
  return {
    dayNumber: dailyPuzzles.dayNumber,
    dailyPuzzles,
    puzzleApps,
  };
}
