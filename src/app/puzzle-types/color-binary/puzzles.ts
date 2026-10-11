import type { Difficulty } from "../../../shared/difficulty";

export type Square = "R" | "B" | ".";

export interface ColorBinaryPuzzle {
  readonly id: string;
  readonly type: "color-binary";
  readonly difficulty: Difficulty;
  readonly author: string;
  readonly license: "CC-BY-4.0";
  readonly start: readonly string[];
  readonly answer: readonly string[];
}

export const sizes: Record<Difficulty, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
};

export const defaultColorBinaryPuzzle: ColorBinaryPuzzle = {
  id: "colour-binary-0005",
  type: "color-binary",
  difficulty: "easy",
  author: "skardela",
  license: "CC-BY-4.0",
  start: ["BR..", "R..B", "R.B.", ".R.R"],
  answer: ["BRRB", "RBRB", "RBBR", "BRBR"],
};

export const mediumColorBinaryPuzzle: ColorBinaryPuzzle = {
  id: "colour-binary-0006",
  type: "color-binary",
  difficulty: "medium",
  author: "skardela",
  license: "CC-BY-4.0",
  start: ["B.R...", "..B.R.", ".R..B.", "R..B..", ".B..R.", "...R.B"],
  answer: ["BBRRBR", "RRBBRB", "BRRBBR", "RBBRRB", "RBRBRB", "BBRRBR"],
};

export const hardColorBinaryPuzzle: ColorBinaryPuzzle = {
  id: "colour-binary-0007",
  type: "color-binary",
  difficulty: "hard",
  author: "skardela",
  license: "CC-BY-4.0",
  start: [
    "BR......",
    "....BR..",
    "..RB....",
    "....RB..",
    "RB......",
    "....BR..",
    "..RB....",
    "....RB..",
  ],
  answer: [
    "BRRBRBBR",
    "RBRBBRRB",
    "BBRRBRRB",
    "RRBBRBBR",
    "RBRBBRRB",
    "BRRBRBBR",
    "BBRRBRRB",
    "RRBBRBBR",
  ],
};

export const colorBinaryPuzzles: ColorBinaryPuzzle[] = [
  defaultColorBinaryPuzzle,
  mediumColorBinaryPuzzle,
  hardColorBinaryPuzzle,
];

export function findColorBinaryPuzzle(id?: string): ColorBinaryPuzzle {
  if (!id) return defaultColorBinaryPuzzle;
  const normalized = id.toLowerCase().replace(/^color-/u, "colour-");
  const found = colorBinaryPuzzles.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.id.toLowerCase() === id.toLowerCase() ||
      normalized.includes(p.difficulty),
  );
  return found ?? defaultColorBinaryPuzzle;
}

export function toSquares(rows: readonly string[]): Square[] {
  return [...rows.join("")] as Square[];
}

export function toRows(squares: readonly Square[]): string[] {
  const size = Math.sqrt(squares.length);
  return Array.from({ length: size }, (_, row) =>
    squares.slice(row * size, row * size + size).join(""),
  );
}
