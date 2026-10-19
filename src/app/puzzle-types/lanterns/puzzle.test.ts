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
  });

  it("creates ten lantern challenges and calculates the pass score", () => {
    expect(createLanternPuzzle("easy").lanterns).toHaveLength(10);
    expect(createLanternPuzzle("medium").difficulty).toBe("medium");
    expect(createLanternPuzzle("medium").lanterns[0]?.statement).not.toBe(
      createLanternPuzzle("easy").lanterns[0]?.statement,
    );
    expect(createLanternPuzzle("hard").difficulty).toBe("hard");
    expect(createLanternPuzzle("tough").difficulty).toBe("tough");
    for (const difficulty of ["easy", "medium", "hard", "tough"] as const) {
      const round = createLanternPuzzle(difficulty, () => 0);
      expect(round.lanterns).toHaveLength(10);
      expect(new Set(round.lanterns.map((item) => item.id)).size).toBe(10);
      expect(round.lanterns.filter((item) => item.statementType === "connected")).toHaveLength(1);
      const linked = round.lanterns.find((item) => item.statementType === "connected");
      expect(round.lanterns.some((item) => item.id === linked?.relatedLanternId)).toBe(true);
      const alternate = createLanternPuzzle(difficulty, () => 0.99);
      expect(alternate.lanterns.find((item) => item.statementType === "connected")?.id).not.toBe(
        linked?.id,
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
