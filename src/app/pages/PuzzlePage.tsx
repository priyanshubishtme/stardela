/**
 * Puzzle Page component.
 * Host playable puzzles with daily challenge headers, difficulty switching, and lazy loading.
 * Support both Color Binary and Guzzle puzzle types.
 */

import { Suspense, type CSSProperties } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import type { Difficulty } from "../../shared/difficulty";
import { text } from "../../text/en";
import { isGuzzlePuzzleId, type LoadedPuzzle } from "../Puzzle";
import ColorBinarySession from "../puzzle-types/color-binary/ColorBinarySession";
import {
  findColorBinaryPuzzle,
  sizes,
  type ColorBinaryPuzzle,
} from "../puzzle-types/color-binary/puzzles";
import GuzzleSession from "../puzzle-types/guzzle/GuzzleSession";
import { findGuzzlePuzzle, type GuzzlePuzzle } from "../puzzle-types/guzzle/puzzles";
import styles from "./PuzzlePage.module.css";

const words = text["color-binary"];

interface LevelTab {
  key: Difficulty;
  label: string;
  size: string;
}

const LEVEL_TABS: LevelTab[] = [
  { key: "easy", label: "Easy", size: "4×4" },
  { key: "medium", label: "Medium", size: "6×6" },
  { key: "hard", label: "Hard", size: "8×8" },
];

/**
 * Difficulty switcher tabs allowing fast level switching on the daily challenge.
 */
function DifficultySwitcher({
  currentDifficulty,
  dailyPuzzles,
}: {
  currentDifficulty: Difficulty;
  dailyPuzzles?: { easy: string; medium: string; hard: string };
}) {
  return (
    <nav className={styles.difficultyTabs} aria-label="Difficulty levels">
      {LEVEL_TABS.map(({ key, label, size }) => {
        const targetId = dailyPuzzles?.[key] ?? key;
        const isActive = currentDifficulty === key;
        const tabClass = [styles.diffTab, isActive ? styles.diffTabActive : ""]
          .filter(Boolean)
          .join(" ");

        return (
          <Link
            key={key}
            to={`/puzzles/${targetId}`}
            className={tabClass}
            aria-current={isActive ? "page" : undefined}
          >
            <span>{label}</span>
            <span className={styles.diffTabSize}>{size}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Header section for Color Binary puzzles with title, daily badges, and level switcher.
 */
function PuzzleHeader({
  puzzle,
  dayNumber,
  isDaily,
  dailyPuzzles,
}: {
  puzzle: ColorBinaryPuzzle;
  dayNumber?: number;
  isDaily?: boolean;
  dailyPuzzles?: { easy: string; medium: string; hard: string };
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        {isDaily && dayNumber && (
          <div className={styles.dayBadge}>
            <span className={styles.dayBadgeIcon}>🌟</span>
            <span>Day {dayNumber} Daily Challenge</span>
          </div>
        )}
        <span className={styles.badge}>Level: {puzzle.difficulty}</span>
        <span className={styles.badge}>Puzzle {puzzle.id}</span>
      </div>

      <h1 className={styles.title}>{words.name}</h1>

      <DifficultySwitcher currentDifficulty={puzzle.difficulty} dailyPuzzles={dailyPuzzles} />
    </header>
  );
}

/**
 * Header section for Guzzle puzzles with title, daily badge, and puzzle ID.
 */
function GuzzlePuzzleHeader({
  puzzle,
  dayNumber,
  isDaily,
}: {
  puzzle: GuzzlePuzzle;
  dayNumber?: number;
  isDaily?: boolean;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        {isDaily && dayNumber && (
          <div className={styles.dayBadge}>
            <span className={styles.dayBadgeIcon}>🌟</span>
            <span>Day {dayNumber} Daily Challenge</span>
          </div>
        )}
        <span className={styles.badge}>Type: {text.guzzle.name}</span>
        <span className={styles.badge}>Puzzle {puzzle.id}</span>
      </div>
      <h1 className={styles.title}>{text.guzzle.name}</h1>
    </header>
  );
}

/**
 * Animated skeleton loading state during React Suspense.
 */
function PuzzleLoading({ size }: { size: number }) {
  const gridStyle = { "--size": size } as CSSProperties & { "--size": number };
  const cellCount = size * size;

  return (
    <output className={styles.loadingArea} aria-live="polite">
      <div className={styles.skeletonGrid} style={gridStyle}>
        {Array.from({ length: cellCount }, (_, i) => (
          <div key={`skeleton-${i}`} className={styles.skeletonCell} />
        ))}
      </div>
      <div className={styles.loadingSpinner} />
      <p className={styles.loadingText}>{text.puzzlePage.loading}</p>
    </output>
  );
}

/**
 * Fallback page for unknown puzzle IDs.
 */
function FallbackPuzzle({ puzzleId }: { puzzleId?: string }) {
  return (
    <div className={styles.container}>
      <title>{text.puzzlePage.title(puzzleId ?? "Puzzle")}</title>
      <span className="visually-hidden">Puzzle Page</span>
      <h1>{puzzleId ?? "Puzzle"}</h1>
      <p>Puzzle Page</p>
    </div>
  );
}

/**
 * Guzzle puzzle view with header and session.
 */
function GuzzlePuzzleView({
  puzzle,
  dayNumber,
  isDaily,
}: {
  puzzle: GuzzlePuzzle;
  dayNumber?: number;
  isDaily?: boolean;
}) {
  return (
    <div className={styles.container}>
      <title>{text.puzzlePage.title(text.guzzle.name)}</title>
      <span className="visually-hidden">Puzzle Page</span>
      <GuzzlePuzzleHeader puzzle={puzzle} dayNumber={dayNumber} isDaily={isDaily} />
      <Suspense fallback={<PuzzleLoading size={puzzle.size} />}>
        <GuzzleSession key={puzzle.id} puzzle={puzzle} />
      </Suspense>
    </div>
  );
}

/**
 * Color Binary puzzle view with header and session.
 */
function ColorBinaryPuzzleView({
  puzzle,
  dayNumber,
  isDaily,
  dailyPuzzles,
}: {
  puzzle: ColorBinaryPuzzle;
  dayNumber?: number;
  isDaily?: boolean;
  dailyPuzzles?: { easy: string; medium: string; hard: string };
}) {
  const size = sizes[puzzle.difficulty];
  return (
    <div className={styles.container}>
      <title>{text.puzzlePage.title(words.name)}</title>
      <span className="visually-hidden">Puzzle Page</span>
      <PuzzleHeader
        puzzle={puzzle}
        dayNumber={dayNumber}
        isDaily={isDaily}
        dailyPuzzles={dailyPuzzles}
      />
      <Suspense fallback={<PuzzleLoading size={size} />}>
        <ColorBinarySession key={puzzle.id} puzzle={puzzle} />
      </Suspense>
    </div>
  );
}

/**
 * Resolve puzzle object and daily IDs for Color Binary.
 */
function resolveColorBinaryData(loaderData?: LoadedPuzzle, puzzleId?: string) {
  const isColorBinary =
    !puzzleId ||
    loaderData?.puzzleType === "color-binary" ||
    puzzleId.toLowerCase().includes("color-binary") ||
    puzzleId.toLowerCase().includes("colour-binary") ||
    puzzleId === "daily";

  if (!isColorBinary && !loaderData) {
    return null;
  }

  const puzzle =
    loaderData?.puzzleType === "color-binary"
      ? (loaderData.puzzle as ColorBinaryPuzzle)
      : findColorBinaryPuzzle(puzzleId);

  const dailyPuzzles = loaderData
    ? {
        easy: loaderData.dailyEasyId,
        medium: loaderData.dailyMediumId,
        hard: loaderData.dailyHardId,
      }
    : undefined;

  return { puzzle, dailyPuzzles };
}

/**
 * Top-level puzzle page.
 * Resolves current puzzle from route loader and renders with Suspense protection.
 * Supports Color Binary, Guzzle, and fallback views.
 */
export function PuzzlePage() {
  const loaderData = useLoaderData<LoadedPuzzle>();
  const { puzzleId: paramPuzzleId } = useParams<{ puzzleId: string }>();
  const puzzleId = loaderData?.puzzleId ?? paramPuzzleId;

  const isGuzzle = loaderData?.puzzleType === "guzzle" || isGuzzlePuzzleId(puzzleId);
  if (isGuzzle) {
    const puzzle =
      loaderData?.puzzleType === "guzzle"
        ? (loaderData.puzzle as GuzzlePuzzle)
        : findGuzzlePuzzle(puzzleId);
    return (
      <GuzzlePuzzleView
        puzzle={puzzle}
        dayNumber={loaderData?.dayNumber}
        isDaily={loaderData?.isDaily}
      />
    );
  }

  const cbData = resolveColorBinaryData(loaderData, puzzleId);
  if (!cbData) {
    return <FallbackPuzzle puzzleId={puzzleId} />;
  }

  return (
    <ColorBinaryPuzzleView
      puzzle={cbData.puzzle}
      dayNumber={loaderData?.dayNumber}
      isDaily={loaderData?.isDaily}
      dailyPuzzles={cbData.dailyPuzzles}
    />
  );
}
