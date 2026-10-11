export const difficulties = ["easy", "medium", "hard"] as const;

export type Difficulty = (typeof difficulties)[number];

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && (difficulties as readonly string[]).includes(value);
}
