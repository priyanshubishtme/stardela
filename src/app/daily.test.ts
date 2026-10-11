import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createDailyPuzzleSet,
  DAILY_STORAGE_KEY,
  getDayNumber,
  getOrGenerateDailyPuzzles,
  getRandomPuzzle,
  getStoredDailyPuzzles,
  saveDailyPuzzles,
} from "./daily";

describe("daily - day number and random", () => {
  it("calculates day number from epoch correctly", () => {
    const epoch = new Date("2026-01-01T00:00:00Z");
    expect(getDayNumber(epoch)).toBe(1);

    const nextDay = new Date("2026-01-02T12:00:00Z");
    expect(getDayNumber(nextDay)).toBe(2);
  });

  it("selects a random puzzle according to difficulty", () => {
    const easy = getRandomPuzzle("easy");
    expect(easy.difficulty).toBe("easy");

    const medium = getRandomPuzzle("medium");
    expect(medium.difficulty).toBe("medium");

    const hard = getRandomPuzzle("hard");
    expect(hard.difficulty).toBe("hard");
  });
});

describe("daily - storage and generation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("generates a new set and caches in localStorage", () => {
    const set = getOrGenerateDailyPuzzles();
    expect(set.dayNumber).toBeGreaterThan(0);
    expect(set.puzzles.easy).toBeDefined();

    const stored = getStoredDailyPuzzles();
    expect(stored).toEqual(set);
  });

  it("reuses stored daily puzzle if day number matches", () => {
    const mockSet = createDailyPuzzleSet();
    mockSet.puzzles.easy = "custom-mock-id";
    saveDailyPuzzles(mockSet);

    const retrieved = getOrGenerateDailyPuzzles();
    expect(retrieved.puzzles.easy).toBe("custom-mock-id");
  });

  it("handles missing or corrupted localStorage gracefully", () => {
    localStorage.setItem(DAILY_STORAGE_KEY, "invalid-json");
    const fresh = getOrGenerateDailyPuzzles();
    expect(fresh.puzzles.easy).toBeDefined();
  });
});
