import type { LoaderFunctionArgs } from "react-router";
import { findColorBinaryPuzzle, type ColorBinaryPuzzle } from "./puzzle-types/color-binary/puzzles";

/**
 * Identifier string for a puzzle category.
 */
export type PuzzleType = string;

/**
 * Data structure returned by the puzzle route loader.
 */
export interface LoadedPuzzle {
  puzzleId: string;
  puzzle: ColorBinaryPuzzle;
}

/**
 * Load puzzle data for the current route.
 * Reads the puzzleId from URL parameters and finds the puzzle.
 * Falls back to default puzzle if no puzzleId is given.
 */
export function puzzleLoader({ params }: LoaderFunctionArgs): LoadedPuzzle {
  const puzzleId = params["puzzleId"] ?? "colour-binary-0005";
  const puzzle = findColorBinaryPuzzle(puzzleId);
  return { puzzleId, puzzle };
}
