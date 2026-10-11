/**
 * Puzzle loading logic and route data structures.
 * Support loading both Color Binary and Guzzle puzzles,
 * including daily challenge resolution and route parameters.
 */

import type { LoaderFunctionArgs } from "react-router";
import { getOrGenerateDailyPuzzles } from "./daily";
import { findColorBinaryPuzzle, type ColorBinaryPuzzle } from "./puzzle-types/color-binary/puzzles";
import { findGuzzlePuzzle, guzzleExample, type GuzzlePuzzle } from "./puzzle-types/guzzle/puzzles";

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
  dailyGuzzleEasyId: string;
  dailyGuzzleMediumId: string;
  dailyGuzzleHardId: string;
}

/**
 * Determine if a puzzle ID or path represents a Guzzle puzzle.
 */
export function isGuzzlePuzzleId(id?: string): boolean {
  if (!id) return false;
  const lower = id.toLowerCase();
  return lower.startsWith("guzzle") || lower.includes("guzzle");
}

function createGuzzleRouteData(
  rawId: string | undefined,
  dailySet: ReturnType<typeof getOrGenerateDailyPuzzles>,
): LoadedPuzzle {
  const gzEasy = dailySet.puzzles.guzzleEasy ?? guzzleExample.id;
  const gzMed = dailySet.puzzles.guzzleMedium ?? "guzzle-0005";
  const gzHard = dailySet.puzzles.guzzleHard ?? "guzzle-0015";
  const isGeneric = !rawId || rawId === "guzzle" || rawId === "daily";
  const puzzle = findGuzzlePuzzle(isGeneric ? gzEasy : rawId);
  const isDaily = isGeneric || puzzle.id === gzEasy || puzzle.id === gzMed || puzzle.id === gzHard;

  return {
    puzzleType: "guzzle",
    puzzleId: puzzle.id,
    puzzle,
    dayNumber: dailySet.dayNumber,
    isDaily,
    dailyEasyId: dailySet.puzzles.easy,
    dailyMediumId: dailySet.puzzles.medium,
    dailyHardId: dailySet.puzzles.hard,
    dailyGuzzleId: gzEasy,
    dailyGuzzleEasyId: gzEasy,
    dailyGuzzleMediumId: gzMed,
    dailyGuzzleHardId: gzHard,
  };
}

function createColorBinaryRouteData(
  rawId: string | undefined,
  dailySet: ReturnType<typeof getOrGenerateDailyPuzzles>,
): LoadedPuzzle {
  const gzEasy = dailySet.puzzles.guzzleEasy ?? guzzleExample.id;
  const gzMed = dailySet.puzzles.guzzleMedium ?? "guzzle-0005";
  const gzHard = dailySet.puzzles.guzzleHard ?? "guzzle-0015";
  const isGeneric =
    !rawId || rawId === "daily" || rawId === "color-binary" || rawId === "colour-binary";
  const puzzle = findColorBinaryPuzzle(isGeneric ? dailySet.puzzles.easy : rawId);
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
    dailyGuzzleId: gzEasy,
    dailyGuzzleEasyId: gzEasy,
    dailyGuzzleMediumId: gzMed,
    dailyGuzzleHardId: gzHard,
  };
}

/**
 * Load puzzle data for the current route.
 * Reads the puzzleId from URL parameters or defaults to today's daily puzzle.
 */
export function puzzleLoader({ params, request }: LoaderFunctionArgs): LoadedPuzzle {
  const dailySet = getOrGenerateDailyPuzzles();
  const rawId = params["puzzleId"];
  const urlPath = request?.url ? new URL(request.url).pathname.toLowerCase() : "";
  const isGuzzleRoute = isGuzzlePuzzleId(rawId) || urlPath.includes("/guzzle");

  return isGuzzleRoute
    ? createGuzzleRouteData(rawId, dailySet)
    : createColorBinaryRouteData(rawId, dailySet);
}
