import { easyLanterns } from "./banks/easy";
import { mediumLanterns } from "./banks/medium";
import { hardLanterns } from "./banks/hard";
import { toughLanterns } from "./banks/tough";
export { easyLanterns, mediumLanterns, hardLanterns, toughLanterns };
export type LanternState = "lit" | "dark";
// Keep Tough local to Lanterns because the other puzzle modes do not support it.
export type LanternDifficulty = "easy" | "medium" | "hard" | "tough";
export type LanternCategory =
  | "science"
  | "technology"
  | "history"
  | "random"
  | "mythological"
  | "mathematics"
  | "current-affairs"
  | "general"
  | "geography"
  | "logic";
export type LanternStatementType = "independent" | "connected";

export interface Lantern {
  readonly id: string;
  readonly category: LanternCategory;
  readonly difficulty: LanternDifficulty;
  readonly statement: string;
  readonly statementType: LanternStatementType;
  readonly correctState: LanternState;
  readonly explanation: string;
  readonly relatedLanternId?: string;
  readonly connectedTargetState?: LanternState;
}

export interface LanternPuzzle {
  readonly id: string;
  readonly type: "lanterns";
  readonly difficulty: LanternDifficulty;
  readonly lanterns: readonly Lantern[];
  readonly selectionCount: number;
  readonly passingPercentage: number;
}

export const LANTERNS_PER_BANK = 20;
export const LANTERNS_PER_CHALLENGE = 10;
export const PASSING_PERCENTAGE = 70;
const LANTERN_CATEGORIES = new Set<LanternCategory>([
  "science",
  "technology",
  "history",
  "random",
  "mythological",
  "mathematics",
  "current-affairs",
  "general",
  "geography",
  "logic",
]);

/** Calculate the number of correct answers needed to pass. */
export function getPassingScore(
  selectionCount: number,
  passingPercentage: number = PASSING_PERCENTAGE,
): number {
  return Math.ceil((selectionCount * passingPercentage) / 100);
}

/** Check one connected clue and its target. */
function validateLanternLink(
  lantern: Lantern,
  lanterns: readonly Lantern[],
  ids: ReadonlySet<string>,
  errors: string[],
) {
  if (lantern.relatedLanternId && !ids.has(lantern.relatedLanternId)) {
    errors.push(`Lantern ${lantern.id} references missing lantern ${lantern.relatedLanternId}.`);
  }
  const target = lanterns.find((item) => item.id === lantern.relatedLanternId);
  if (lantern.statementType === "connected" && target?.statementType !== "independent") {
    errors.push(`Connected lantern ${lantern.id} must reference an independent lantern.`);
  }
  if (lantern.statementType === "connected" && target && lantern.connectedTargetState) {
    const expectedState = target.correctState === lantern.connectedTargetState ? "lit" : "dark";
    if (lantern.correctState !== expectedState) {
      errors.push(`Connected lantern ${lantern.id} has an answer that conflicts with its target.`);
    }
  }
  if (lantern.statementType === "independent" && lantern.connectedTargetState !== undefined) {
    errors.push(`Independent lantern ${lantern.id} must not define a connected target state.`);
  }
}

/** Check IDs, references, and the expected bank size. */
export function validateLanternBank(lanterns: readonly Lantern[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const ids = new Set<string>();
  if (lanterns.length !== LANTERNS_PER_BANK) {
    errors.push(`Expected ${LANTERNS_PER_BANK} lanterns, received ${lanterns.length}.`);
  }
  for (const lantern of lanterns) {
    if (ids.has(lantern.id)) errors.push(`Duplicate lantern ID: ${lantern.id}.`);
    ids.add(lantern.id);
    if (lantern.statementType === "independent" && lantern.relatedLanternId !== undefined) {
      errors.push(`Independent lantern ${lantern.id} must not reference another lantern.`);
    }
    if (lantern.statementType === "connected" && lantern.relatedLanternId === undefined) {
      errors.push(`Connected lantern ${lantern.id} must reference another lantern.`);
    }
    if (lantern.statementType === "connected" && lantern.connectedTargetState === undefined) {
      errors.push(`Connected lantern ${lantern.id} must define the target state it describes.`);
    }
    if (lantern.relatedLanternId === lantern.id) {
      errors.push(`Lantern ${lantern.id} must not reference itself.`);
    }
    if (!lantern.statement.trim()) errors.push(`Lantern ${lantern.id} has no statement.`);
    if (!lantern.explanation.trim()) errors.push(`Lantern ${lantern.id} has no explanation.`);
    if (!LANTERN_CATEGORIES.has(lantern.category))
      errors.push(`Lantern ${lantern.id} has an invalid category.`);
    if (lantern.correctState !== "lit" && lantern.correctState !== "dark") {
      errors.push(`Lantern ${lantern.id} has an invalid answer.`);
    }
  }
  if (lanterns.filter((lantern) => lantern.statementType === "connected").length !== 2) {
    errors.push("Each bank must contain two connected lanterns.");
  }
  for (const lantern of lanterns) validateLanternLink(lantern, lanterns, ids, errors);
  return { valid: errors.length === 0, errors };
}

/** Select lanterns for one difficulty. */
export function getLanternsByDifficulty(
  lanterns: readonly Lantern[],
  difficulty: LanternDifficulty,
): Lantern[] {
  return lanterns.filter((lantern) => lantern.difficulty === difficulty);
}

/** Select lanterns in one category. */
export function getLanternsByCategory(
  lanterns: readonly Lantern[],
  category: LanternCategory,
): Lantern[] {
  return lanterns.filter((lantern) => lantern.category === category);
}

/** Find one lantern by its ID. */
export function findLantern(lanterns: readonly Lantern[], id: string): Lantern | undefined {
  return lanterns.find((lantern) => lantern.id === id);
}

const banks: Record<LanternDifficulty, readonly Lantern[]> = {
  easy: easyLanterns,
  medium: mediumLanterns,
  hard: hardLanterns,
  tough: toughLanterns,
};

/** Show all twenty lanterns while the player classifies ten of them. */
export function createLanternPuzzle(
  difficulty: LanternDifficulty,
  random: () => number = Math.random,
): LanternPuzzle {
  const bank = banks[difficulty];
  const validation = validateLanternBank(bank);
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  const lanterns = [...bank];
  for (let index = lanterns.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [lanterns[index], lanterns[swap]] = [lanterns[swap]!, lanterns[index]!];
  }
  return {
    id: `lanterns-${difficulty}-${Math.floor(random() * 1_000_000)}`,
    type: "lanterns",
    difficulty,
    lanterns,
    selectionCount: LANTERNS_PER_CHALLENGE,
    passingPercentage: PASSING_PERCENTAGE,
  };
}
