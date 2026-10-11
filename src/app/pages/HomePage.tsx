/**
 * Home Page component.
 * Displays daily challenge information, featured puzzle types,
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
 * Explain how the daily challenge works.
 */
function DailyInfo({ dayNumber }: { dayNumber: number }) {
  return (
    <section className={styles.dailyInfo} aria-label="About the daily challenge">
      <h2 className={styles.dailyInfoTitle}>
        Daily Challenge — Day {dayNumber}
      </h2>
      <p className={styles.dailyInfoText}>
        Every day, Skardela picks a new set of puzzles for you.
        Solve <span className={styles.dailyInfoHighlight}>Colour Binary</span> in three difficulty levels (Easy 4×4, Medium 6×6, Hard 8×8),
        or take on the <span className={styles.dailyInfoHighlight}>Guzzle</span> cross-word daily challenge!
      </p>
      <p className={styles.dailyInfoText}>
        The daily puzzles reset at midnight. Come back tomorrow for a fresh set.
        Can you solve all puzzles before the day ends?
      </p>
    </section>
  );
}

/**
 * Card for Colour Binary puzzle.
 * Displays title, summary, and links to each difficulty level.
 */
function ColourBinaryCard({ dailyPuzzles }: { dailyPuzzles: DailyPuzzleSet }) {
  return (
    <div className={styles.puzzleCard}>
      <h3 className={styles.puzzleName}>{colorBinary.name}</h3>
      <p className={styles.puzzleSummary}>{colorBinary.summary}</p>
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
function GuzzleCard({ dailyPuzzleId }: { dailyPuzzleId: string }) {
  return (
    <div className={styles.puzzleCard}>
      <h3 className={styles.puzzleName}>{guzzle.name}</h3>
      <p className={styles.puzzleSummary}>{guzzle.summary}</p>
      <div className={styles.difficultyList}>
        <Link to={`/puzzles/${dailyPuzzleId}`} className={styles.difficultyBtn}>
          Play Daily
        </Link>
        <Link to="/guzzle" className={styles.difficultyBtn}>
          Play
        </Link>
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
      <h3 className={styles.puzzleName}>{title}</h3>
      <p className={styles.puzzleSummary}>{summary}</p>
    </div>
  );
}

/**
 * Home page view.
 * Displays day number, daily challenge information, and available puzzle types.
 */
export function HomePage() {
  const loaderData = useLoaderData<HomeLoaderData>();
  const data = loaderData ?? homeLoader();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.dayBadge}>Day {data.dayNumber}</div>
        <h1 className={styles.title}>Puzzle Collection</h1>
        <p className={styles.subtitle}>
          Free daily puzzles of new types. No account, no download.
        </p>
      </header>

      <DailyInfo dayNumber={data.dayNumber} />

      <section>
        <h2 className={styles.puzzleHeading}>Puzzle types</h2>

        <div className={styles.puzzleGrid}>
          {data.puzzleApps.map((app) => {
            if (!app.isAvailable) {
              return <ComingSoonCard key={app.id} title={app.name} summary={app.summary} />;
            }
            if (app.id === "guzzle") {
              return (
                <GuzzleCard
                  key={app.id}
                  dailyPuzzleId={data.dailyPuzzles.puzzles.guzzle ?? "guzzle-0000"}
                />
              );
            }
            return <ColourBinaryCard key={app.id} dailyPuzzles={data.dailyPuzzles} />;
          })}
        </div>
      </section>
    </div>
  );
}
