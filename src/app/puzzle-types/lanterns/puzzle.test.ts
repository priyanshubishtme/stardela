import { describe, expect, it } from "vitest";
import {
  createLanternPuzzle,
  easyLanterns,
  hardLanterns,
  getLanternsByCategory,
  getPassingScore,
  mediumLanterns,
  toughLanterns,
  validateLanternBank,
} from "./puzzle";

describe("Lanterns puzzle data", () => {
  it("provides a valid bank of twenty unique lanterns", () => {
    expect(easyLanterns).toHaveLength(20);
    expect(validateLanternBank(easyLanterns)).toEqual({ valid: true, errors: [] });
    for (const bank of [mediumLanterns, hardLanterns, toughLanterns]) {
      expect(bank).toHaveLength(20);
      expect(validateLanternBank(bank)).toEqual({ valid: true, errors: [] });
    }
    for (const bank of [easyLanterns, mediumLanterns, hardLanterns, toughLanterns]) {
      expect(new Set(bank.map((item) => item.statement)).size).toBe(20);
      expect(bank.filter((item) => item.statementType === "independent")).toHaveLength(18);
      expect(bank.every((item) => item.explanation.trim().length > 0)).toBe(true);
    }
  });

  it("shows twenty lantern choices and calculates the ten-answer pass score", () => {
    expect(createLanternPuzzle("easy").lanterns).toHaveLength(20);
    expect(createLanternPuzzle("medium").difficulty).toBe("medium");
    expect(createLanternPuzzle("medium").lanterns[0]?.statement).not.toBe(
      createLanternPuzzle("easy").lanterns[0]?.statement,
    );
    expect(createLanternPuzzle("hard").difficulty).toBe("hard");
    expect(createLanternPuzzle("tough").difficulty).toBe("tough");
    for (const difficulty of ["easy", "medium", "hard", "tough"] as const) {
      const round = createLanternPuzzle(difficulty, () => 0);
      expect(round.lanterns).toHaveLength(20);
      expect(new Set(round.lanterns.map((item) => item.id)).size).toBe(20);
      expect(round.lanterns.filter((item) => item.statementType === "connected")).toHaveLength(2);
      expect(round.selectionCount).toBe(10);
      const alternate = createLanternPuzzle(difficulty, () => 0.99);
      expect(alternate.lanterns.map((item) => item.id)).not.toEqual(
        round.lanterns.map((item) => item.id),
      );
    }
    expect(getPassingScore(10)).toBe(7);
  });

  it("filters clues by category", () => {
    const scienceClues = getLanternsByCategory(easyLanterns, "science");
    expect(scienceClues.length).toBeGreaterThan(0);
    expect(scienceClues.every((item) => item.category === "science")).toBe(true);
  });
});
