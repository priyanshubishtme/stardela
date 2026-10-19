import type { Lantern, LanternDifficulty } from "./puzzle";

/** Convert a clue into a stable, difficulty-specific lantern. */
function createLantern(
  fact: Omit<Lantern, "id" | "difficulty">,
  index: number,
  difficulty: LanternDifficulty,
): Lantern {
  return {
    id: `lantern-${difficulty}-${String(index + 1).padStart(3, "0")}`,
    category: fact.category,
    difficulty,
    statement: fact.statement,
    statementType: fact.statementType,
    correctState: fact.correctState,
    explanation: fact.explanation,
  };
}

/** Build a twenty item bank with two deterministic links to independent clues. */
export function createLanternBank(
  facts: readonly Omit<Lantern, "id" | "difficulty">[],
  difficulty: LanternDifficulty,
): readonly Lantern[] {
  if (facts.length < 18) throw new Error(`${difficulty} needs 18 independent clues.`);
  const independent = facts
    .slice(0, 18)
    .map((fact, index) => createLantern(fact, index, difficulty));
  const connected = [0, 1].map((index) => {
    const target = independent[index];
    if (!target) throw new Error(`Missing connected clue target for ${difficulty}.`);
    const targetNumber = target.id.slice(-3);
    const trueStatement = target.correctState === "lit";
    return {
      id: `lantern-${difficulty}-${String(index + 19).padStart(3, "0")}`,
      difficulty,
      category: "logic" as const,
      statementType: "connected" as const,
      relatedLanternId: target.id,
      correctState: trueStatement ? ("lit" as const) : ("dark" as const),
      statement: `Lantern ${targetNumber} has a true statement.`,
      explanation: `Lantern ${targetNumber} is ${trueStatement ? "lit" : "dark"}, so its statement is ${trueStatement ? "true" : "false"}.`,
    };
  });
  return [...independent, ...connected];
}
