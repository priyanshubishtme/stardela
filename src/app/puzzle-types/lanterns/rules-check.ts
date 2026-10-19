import type { Lantern, LanternState } from "./puzzle";

/** Return the truth state of one statement for a completed board. */
export function evaluateLantern(lantern: Lantern, round: readonly Lantern[]): LanternState {
  if (lantern.statementType === "connected" && lantern.relatedLanternId) {
    const target = round.find((item) => item.id === lantern.relatedLanternId);
    if (!target) throw new Error(`Connected lantern ${lantern.id} has no target in this round.`);
    return target.correctState;
  }
  return lantern.correctState;
}

/** Count answers after all lanterns have been classified. */
export function scoreLanterns(
  lanterns: readonly Lantern[],
  answers: Readonly<Record<string, LanternState>>,
): { correct: number; total: number } {
  return {
    correct: lanterns.filter(
      (lantern) => answers[lantern.id] === evaluateLantern(lantern, lanterns),
    ).length,
    total: lanterns.length,
  };
}
