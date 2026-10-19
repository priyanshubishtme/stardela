import { describe, expect, it } from "vitest";
import { createLanternPuzzle } from "./puzzle";
import type { Lantern, LanternState } from "./puzzle";
import { evaluateLantern, scoreLanterns } from "./rules-check";

function makeTarget(template: Lantern, id: string, correctState: LanternState): Lantern {
  return {
    ...template,
    id,
    statementType: "independent",
    relatedLanternId: undefined,
    connectedTargetState: undefined,
    correctState,
  };
}

function makeLink(
  template: Lantern,
  id: string,
  target: Lantern,
  connectedTargetState: LanternState,
  correctState: LanternState,
): Lantern {
  return { ...template, id, relatedLanternId: target.id, connectedTargetState, correctState };
}

describe("Lanterns scoring", () => {
  it("scores all expected answers after the round", () => {
    const round = createLanternPuzzle("easy", () => 0).lanterns;
    const answers = Object.fromEntries(round.map((item) => [item.id, item.correctState]));
    expect(scoreLanterns(round, answers)).toEqual({ correct: 20, total: 20 });
  });

  it("counts incorrect answers across the twenty-lantern board", () => {
    const round = createLanternPuzzle("medium", () => 0).lanterns;
    const answers = Object.fromEntries(round.map((item) => [item.id, item.correctState]));
    const opposite: Record<LanternState, LanternState> = { lit: "dark", dark: "lit" };
    const invert = (current: Record<string, LanternState>, index: number) => ({
      ...current,
      [round[index]!.id]: opposite[answers[round[index]!.id]!],
    });
    const threeMisses = [0, 1, 2].reduce((current, index) => invert(current, index), answers);
    expect(scoreLanterns(round, threeMisses).correct).toBe(17);
    expect(scoreLanterns(round, invert(threeMisses, 3)).correct).toBe(16);
  });
});

describe("connected lantern rules", () => {
  it("uses the target truth for the generated link", () => {
    const round = createLanternPuzzle("easy", () => 0).lanterns;
    const linked = round.find((item) => item.statementType === "connected")!;
    expect(evaluateLantern(linked, round)).toBe(linked.correctState);
  });

  it("evaluates true and false descriptions of a target", () => {
    const template = createLanternPuzzle("easy", () => 0).lanterns.find(
      (item) => item.statementType === "connected",
    )!;
    const litTarget = makeTarget(template, "target-lit", "lit");
    const darkTarget = makeTarget(template, "target-dark", "dark");
    const litDescription = makeLink(template, "link-lit", litTarget, "lit", "lit");
    const falseDescription = makeLink(template, "link-false", darkTarget, "lit", "dark");
    const darkDescription = makeLink(template, "link-dark", darkTarget, "dark", "lit");
    expect(evaluateLantern(litDescription, [litTarget, litDescription])).toBe("lit");
    expect(evaluateLantern(falseDescription, [darkTarget, falseDescription])).toBe("dark");
    expect(evaluateLantern(darkDescription, [darkTarget, darkDescription])).toBe("lit");
  });
});
