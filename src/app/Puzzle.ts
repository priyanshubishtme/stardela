/**
 * Puzzle loading logic and route data structures.
 * Support loading both Color Binary and Guzzle puzzles,
 * including daily challenge resolution and route parameters.
 */

import type { LoaderFunctionArgs } from "react-router";
import { getOrGenerateDailyPuzzles } from "./daily";
import {
  findColorBinaryPuzzle,
  type ColorBinaryPuzzle,
} from "./puzzle-types/color-binary/puzzles";
import {
  findGuzzlePuzzle,
  guzzleExample,
  type GuzzlePuzzle,
} from "./puzzle-types/guzzle/puzzles";

/**
 * Identifier string for a puzzle category.
 */
export type PuzzleType = "color-binary" | "guzzle";

/**
 * Data structure returned by the puzzle route loader.
 */
export interface LoadedPuzzle {
  puzzleType: "color-binary" | "guzzle";
  puzzleId: string;
  puzzle: ColorBinaryPuzzle | GuzzlePuzzle;
  dayNumber: number;
  isDaily: boolean;
  dailyEasyId: string;
  dailyMediumId: string;
  dailyHardId: string;
  dailyGuzzleId: string;
}

/**
 * Determine if a puzzle ID or path represents a Guzzle puzzle.
 */
export function isGuzzlePuzzleId(id?: string): boolean {
  if (!id) return false;
  const lower = id.toLowerCase();
  return lower.startsWith("guzzle") || lower.includes("guzzle");
}

/**
 * Load puzzle data for the current route.
 * Reads the puzzleId from URL parameters or defaults to today's daily puzzle.
 */
export function puzzleLoader({ params, request }: LoaderFunctionArgs): LoadedPuzzle {
  const dailySet = getOrGenerateDailyPuzzles();
  const rawId = params["puzzleId"];

  /* Check whether URL pathname or puzzleId matches Guzzle */
  const urlPath = request?.url ? new URL(request.url).pathname.toLowerCase() : "";
  const isGuzzleRoute = isGuzzlePuzzleId(rawId) || urlPath.includes("/guzzle");

  if (isGuzzleRoute) {
    const isGeneric = !rawId || rawId === "guzzle" || rawId === "daily";
    const puzzleId = isGeneric ? (dailySet.puzzles.guzzle ?? guzzleExample.id) : rawId;
    const puzzle = findGuzzlePuzzle(puzzleId);
    const isDaily = isGeneric || puzzle.id === dailySet.puzzles.guzzle;

    return {
      puzzleType: "guzzle",
      puzzleId: puzzle.id,
      puzzle,
      dayNumber: dailySet.dayNumber,
      isDaily,
      dailyEasyId: dailySet.puzzles.easy,
      dailyMediumId: dailySet.puzzles.medium,
      dailyHardId: dailySet.puzzles.hard,
      dailyGuzzleId: dailySet.puzzles.guzzle ?? guzzleExample.id,
    };
  }

  /* Otherwise default to Color Binary */
  const isGeneric =
    !rawId || rawId === "daily" || rawId === "color-binary" || rawId === "colour-binary";
  const puzzleId = isGeneric ? dailySet.puzzles.easy : rawId;
  const puzzle = findColorBinaryPuzzle(puzzleId);
  const isDaily =
    puzzle.id === dailySet.puzzles.easy ||
    puzzle.id === dailySet.puzzles.medium ||
    puzzle.id === dailySet.puzzles.hard;

  return {
    puzzleType: "color-binary",
    puzzleId: puzzle.id,
    puzzle,
    dayNumber: dailySet.dayNumber,
    isDaily,
    dailyEasyId: dailySet.puzzles.easy,
    dailyMediumId: dailySet.puzzles.medium,
    dailyHardId: dailySet.puzzles.hard,
    dailyGuzzleId: dailySet.puzzles.guzzle ?? guzzleExample.id,
  };
}
