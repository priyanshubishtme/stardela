/**
 * Home Page component.
 * Displays daily challenge banner, featured puzzle types,
 * and quick-start links for Color Binary and Guzzle.
 */

import { Link, useLoaderData } from "react-router";
import type { Difficulty } from "../../shared/difficulty";
import { text } from "../../text/en";
import { homeLoader, type DailyPuzzleSet, type HomeLoaderData } from "../daily";
import styles from "./HomePage.module.css";

const colorBinary = text["color-binary"];
const guzzle = text.guzzle;

/**
 * Difficulty levels with display labels.
 */
const levels: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

/**
 * Compact banner explaining daily puzzle refresh.
 */
function DailyInfo({ dayNumber }: { dayNumber: number }) {
  return (
    <div className={styles.dailyBanner} aria-label="About the daily challenge">
      <span className={styles.dailyIcon} aria-hidden="true">
        🌟
      </span>
      <p className={styles.dailyText}>
        <strong>Day {dayNumber} Daily Challenge:</strong> Puzzles reset at midnight. Solve{" "}
        <span className={styles.dailyHighlight}>Colour Binary</span> (Easy, Medium, Hard) or{" "}
        <span className={styles.dailyHighlight}>Guzzle</span> cross-word daily challenge!
      </p>
    </div>
  );
}

/**
 * Card for Colour Binary puzzle.
 * Displays title, summary, and links to each difficulty level.
 */
function ColourBinaryCard({ dailyPuzzles }: { dailyPuzzles: DailyPuzzleSet }) {
  return (
    <div className={styles.puzzleCard}>
      <div className={styles.puzzleCardContent}>
        <h3 className={styles.puzzleName}>{colorBinary.name}</h3>
        <p className={styles.puzzleSummary}>{colorBinary.summary}</p>
      </div>
      <div className={styles.difficultyList}>
        {levels.map(({ key, label }) => (
          <Link
            key={key}
            to={`/puzzles/${dailyPuzzles.puzzles[key]}`}
            className={styles.difficultyBtn}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Card for Guzzle puzzle.
 * Displays title, summary, and links to play the daily challenge or open Guzzle.
 */
function GuzzleCard({ dailyPuzzles }: { dailyPuzzles: DailyPuzzleSet }) {
  const guzzleDaily: Record<Difficulty, string> = {
    easy: dailyPuzzles.puzzles.guzzleEasy ?? "guzzle-0000",
    medium: dailyPuzzles.puzzles.guzzleMedium ?? "guzzle-0005",
    hard: dailyPuzzles.puzzles.guzzleHard ?? "guzzle-0015",
  };

  return (
    <div className={styles.puzzleCard}>
      <div className={styles.puzzleCardContent}>
        <h3 className={styles.puzzleName}>{guzzle.name}</h3>
        <p className={styles.puzzleSummary}>{guzzle.summary}</p>
      </div>
      <div className={styles.difficultyList}>
        {levels.map(({ key, label }) => (
          <Link key={key} to={`/puzzles/${guzzleDaily[key]}`} className={styles.difficultyBtn}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Placeholder card for unreleased puzzle types.
 */
function ComingSoonCard({ title, summary }: { title: string; summary: string }) {
  return (
    <div className={styles.puzzleCard}>
      <span className={styles.comingSoonBadge}>Coming Soon</span>
      <div className={styles.puzzleCardContent}>
        <h3 className={styles.puzzleName}>{title}</h3>
        <p className={styles.puzzleSummary}>{summary}</p>
      </div>
    </div>
  );
}

/**
 * Home page view.
 * Displays day number, compact daily challenge information, and available puzzle types.
 */
export function HomePage() {
  const loaderData = useLoaderData<HomeLoaderData>();
  const data = loaderData ?? homeLoader();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.dayBadge}>Day {data.dayNumber}</div>
        </div>
        <h1 className={styles.title}>Puzzle Collection</h1>
        <p className={styles.subtitle}>Free daily puzzles of new types. No account, no download.</p>
      </header>

      <DailyInfo dayNumber={data.dayNumber} />

      <section className={styles.puzzleSection}>
        <h2 className={styles.puzzleHeading}>Puzzle types</h2>

        <div className={styles.puzzleGrid}>
          {data.puzzleApps.map((app) => {
            if (!app.isAvailable) {
              return <ComingSoonCard key={app.id} title={app.name} summary={app.summary} />;
            }
            if (app.id === "guzzle") {
              return <GuzzleCard key={app.id} dailyPuzzles={data.dailyPuzzles} />;
            }
            return <ColourBinaryCard key={app.id} dailyPuzzles={data.dailyPuzzles} />;
          })}
        </div>
      </section>
    </div>
  );
}
