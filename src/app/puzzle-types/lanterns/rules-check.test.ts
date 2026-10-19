import { describe, expect, it } from "vitest";
import { createLanternPuzzle } from "./puzzle";
import type { LanternState } from "./puzzle";
import { evaluateLantern, scoreLanterns } from "./rules-check";

describe("Lanterns scoring", () => {
  it("scores against the expected answers, including deterministic linked clues", () => {
    const round = createLanternPuzzle("easy", () => 0).lanterns;
    const answers = Object.fromEntries(round.map((item) => [item.id, item.correctState]));
    expect(scoreLanterns(round, answers)).toEqual({ correct: 10, total: 10 });

    const linked = round.find((item) => item.statementType === "connected")!;
    const target = round.find((item) => item.id === linked.relatedLanternId)!;
    expect(evaluateLantern(linked, round)).toBe(target.correctState);
  });

  it("counts seven correct as a pass and six correct as a fail", () => {
    const round = createLanternPuzzle("medium", () => 0).lanterns;
    const answers = Object.fromEntries(round.map((item) => [item.id, item.correctState]));
    const opposite: Record<LanternState, LanternState> = { lit: "dark", dark: "lit" };
    const invert = (current: Record<string, LanternState>, index: number) => ({
      ...current,
      [round[index]!.id]: opposite[answers[round[index]!.id]!],
    });
    const threeMisses = [0, 1, 2].reduce((current, index) => invert(current, index), answers);
    const fourMisses = invert(threeMisses, 3);
    expect(scoreLanterns(round, threeMisses).correct).toBe(7);
    expect(scoreLanterns(round, fourMisses).correct).toBe(6);
  });
});
