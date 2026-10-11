import type { Square } from "./puzzles";

function checkLineRules(line: readonly Square[], half: number): boolean {
  let redCount = 0;
  let blueCount = 0;
  let consecutiveColor: Square = ".";
  let consecutiveCount = 0;

  for (const sq of line) {
    if (sq === "R") redCount++;
    if (sq === "B") blueCount++;

    if (sq !== "." && sq === consecutiveColor) {
      consecutiveCount++;
      if (consecutiveCount >= 3) return false;
    } else {
      consecutiveColor = sq;
      consecutiveCount = sq === "." ? 0 : 1;
    }
  }

  return redCount <= half && blueCount <= half;
}

export function checkRules(squares: readonly Square[]): boolean {
  const size = Math.sqrt(squares.length);
  const half = size / 2;

  // Check rows
  for (let r = 0; r < size; r++) {
    const row = Array.from({ length: size }, (_, c) => squares[r * size + c] ?? ".");
    if (!checkLineRules(row, half)) return false;
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    const col = Array.from({ length: size }, (_, r) => squares[r * size + c] ?? ".");
    if (!checkLineRules(col, half)) return false;
  }

  return true;
}
