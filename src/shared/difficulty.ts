/**
 * List of all puzzle difficulty levels.
 */
export const difficulties = ["easy", "medium", "hard"] as const;

/**
 * Type representing an allowed difficulty level.
 */
export type Difficulty = (typeof difficulties)[number];

/**
 * Check if a value is a valid difficulty level.
 * @param value - The input value to check.
 * @returns True if value is easy, medium, or hard.
 */
export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && (difficulties as readonly string[]).includes(value);
}
