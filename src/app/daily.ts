import type { Difficulty } from "../shared/difficulty";
import {
  colorBinaryPuzzles,
  defaultColorBinaryPuzzle,
  hardColorBinaryPuzzle,
  mediumColorBinaryPuzzle,
  type ColorBinaryPuzzle,
} from "./puzzle-types/color-binary/puzzles";
import {
  findGuzzlePuzzle,
  guzzleExample,
  guzzlePuzzles,
  type GuzzlePuzzle,
} from "./puzzle-types/guzzle/puzzles";

/**
 * Start date used to calculate the daily puzzle number.
 */
export const EPOCH_DATE = new Date("2026-01-01T00:00:00Z");

/**
 * Key name used to store daily puzzles in browser local storage.
 */
export const DAILY_STORAGE_KEY = "skardela_daily_puzzles";

/**
 * Data structure for a daily puzzle set.
 */
export interface DailyPuzzleSet {
  dayNumber: number;
  date: string;
  puzzles: {
    easy: string;
    medium: string;
    hard: string;
    guzzle: string;
  };
}

/**
 * Metadata for a puzzle application displayed on the home page.
 */
export interface PuzzleAppInfo {
  id: string;
  name: string;
  summary: string;
  isAvailable: boolean;
}

/**
 * List of puzzle types shown on the home page.
 */
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
    isAvailable: true,
  },
  {
    id: "lanterns",
    name: "Lanterns",
    summary: "Lit lanterns tell the truth, dark lanterns lie.",
    isAvailable: false,
  },
];

/**
 * Data returned by the home page loader.
 */
export interface HomeLoaderData {
  dayNumber: number;
  dailyPuzzles: DailyPuzzleSet;
  puzzleApps: PuzzleAppInfo[];
}

/**
 * Calculate the day number starting from EPOCH_DATE.
 * @param date - The target date (defaults to current date).
 * @returns The positive day number.
 */
export function getDayNumber(date: Date = new Date()): number {
  const diffMs = date.getTime() - EPOCH_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

/**
 * Convert a date object to a YYYY-MM-DD string.
 */
export function getTodayDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0] ?? "2026-10-11";
}

/**
 * Select a random puzzle from the collection, optionally filtered by difficulty.
 */
export function getRandomPuzzle(difficulty?: Difficulty): ColorBinaryPuzzle {
  const pool = difficulty
    ? colorBinaryPuzzles.filter((p) => p.difficulty === difficulty)
    : colorBinaryPuzzles;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? defaultColorBinaryPuzzle;
}

/**
 * Read the cached daily puzzle set from local storage.
 * @returns Cached set or null if not found.
 */
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

/**
 * Save the daily puzzle set to local storage.
 */
export function saveDailyPuzzles(data: DailyPuzzleSet): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage write failed or is disabled
  }
}

/**
 * Pick a daily puzzle ID deterministically based on day number.
 */
function pickDailyPuzzleId<T extends { id: string }>(
  list: readonly T[],
  dayNumber: number,
  fallbackId: string,
): string {
  if (list.length === 0) return fallbackId;
  const idx = Math.abs(dayNumber - 1) % list.length;
  return list[idx]?.id ?? fallbackId;
}

/**
 * Create a new set of puzzles for the given date.
 */
export function createDailyPuzzleSet(date: Date = new Date()): DailyPuzzleSet {
  const dayNumber = getDayNumber(date);
  const dateStr = getTodayDateString(date);

  const mediumList = colorBinaryPuzzles.filter((p) => p.difficulty === "medium");
  const hardList = colorBinaryPuzzles.filter((p) => p.difficulty === "hard");

  return {
    dayNumber,
    date: dateStr,
    puzzles: {
      easy: defaultColorBinaryPuzzle.id,
      medium: pickDailyPuzzleId(mediumList, dayNumber, mediumColorBinaryPuzzle.id),
      hard: pickDailyPuzzleId(hardList, dayNumber, hardColorBinaryPuzzle.id),
      guzzle: pickDailyPuzzleId(guzzlePuzzles, dayNumber, guzzleExample.id),
    },
  };
}

/**
 * Get daily puzzle for a specific difficulty level.
 */
export function getDailyPuzzle(
  difficulty: Difficulty = "easy",
  date: Date = new Date(),
): ColorBinaryPuzzle {
  const set = getOrGenerateDailyPuzzles(date);
  const puzzleId = set.puzzles[difficulty];
  const found = colorBinaryPuzzles.find((p) => p.id === puzzleId);
  return found ?? defaultColorBinaryPuzzle;
}

/**
 * Get daily Guzzle puzzle for the given date.
 */
export function getDailyGuzzlePuzzle(date: Date = new Date()): GuzzlePuzzle {
  const set = getOrGenerateDailyPuzzles(date);
  return findGuzzlePuzzle(set.puzzles.guzzle);
}

/**
 * Get daily puzzles. Reads from local storage if available for today;
 * otherwise generates a new daily set and saves it.
 */
export function getOrGenerateDailyPuzzles(date: Date = new Date()): DailyPuzzleSet {
  const dayNumber = getDayNumber(date);
  const stored = getStoredDailyPuzzles();
  if (stored && stored.dayNumber === dayNumber) {
    /* If cached set was saved without a guzzle puzzle, migrate it */
    if (!stored.puzzles.guzzle) {
      stored.puzzles.guzzle = pickDailyPuzzleId(guzzlePuzzles, dayNumber, guzzleExample.id);
      saveDailyPuzzles(stored);
    }
    return stored;
  }
  const fresh = createDailyPuzzleSet(date);
  saveDailyPuzzles(fresh);
  return fresh;
}

/**
 * Route loader for the home page.
 * Returns day number, daily puzzle IDs, and puzzle type list.
 */
export function homeLoader(): HomeLoaderData {
  const dailyPuzzles = getOrGenerateDailyPuzzles();
  return {
    dayNumber: dailyPuzzles.dayNumber,
    dailyPuzzles,
    puzzleApps,
  };
}
