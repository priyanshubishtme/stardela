import type { LoaderFunctionArgs } from "react-router";

export type PuzzleType = string;

export interface LoadedPuzzle {
  puzzleId: string;
}

export function puzzleLoader({ params }: LoaderFunctionArgs): LoadedPuzzle | null {
  const puzzleId = params["puzzleId"] ?? "";
  return { puzzleId };
}
