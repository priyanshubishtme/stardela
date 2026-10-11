import type { LoaderFunctionArgs } from "react-router";
import { findColorBinaryPuzzle, type ColorBinaryPuzzle } from "./puzzle-types/color-binary/puzzles";

export type PuzzleType = string;

export interface LoadedPuzzle {
  puzzleId: string;
  puzzle: ColorBinaryPuzzle;
}

export function puzzleLoader({ params }: LoaderFunctionArgs): LoadedPuzzle {
  const puzzleId = params["puzzleId"] ?? "colour-binary-0005";
  const puzzle = findColorBinaryPuzzle(puzzleId);
  return { puzzleId, puzzle };
}
