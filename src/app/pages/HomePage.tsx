import { Link, useLoaderData } from "react-router";
import type { Difficulty } from "../../shared/difficulty";
import { text } from "../../text/en";
import { homeLoader, type DailyPuzzleSet, type HomeLoaderData } from "../daily";
import styles from "./HomePage.module.css";

const colorBinary = text["color-binary"];

/**
 * Difficulty levels with display labels.
 */
const levels: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

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
 * Displays day number, introduction, and available puzzle types.
 */
export function HomePage() {
  const loaderData = useLoaderData<HomeLoaderData>();
  const data = loaderData ?? homeLoader();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.dayBadge}>Day {data.dayNumber}</div>
        <h1 className={styles.title}>Puzzle Collection</h1>
        <p className={styles.subtitle}>Explore our mind-bending challenges</p>
      </header>

      <section>
        <h2 className={styles.puzzleHeading}>Puzzle types</h2>

        <div className={styles.puzzleGrid}>
          {data.puzzleApps.map((app) =>
            app.isAvailable ? (
              <ColourBinaryCard key={app.id} dailyPuzzles={data.dailyPuzzles} />
            ) : (
              <ComingSoonCard key={app.id} title={app.name} summary={app.summary} />
            ),
          )}
        </div>
      </section>
    </div>
  );
}
