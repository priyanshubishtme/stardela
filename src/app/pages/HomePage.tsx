import { Link } from "react-router";
import { text } from "../../text/en";
import styles from "./HomePage.module.css";

const colorBinary = text["color-binary"];

function ColourBinaryCard() {
  return (
    <div className={styles.puzzleCard}>
      <h3 className={styles.puzzleName}>{colorBinary.name}</h3>
      <p className={styles.puzzleSummary}>{colorBinary.summary}</p>
      <div className={styles.difficultyList}>
        <Link to="/puzzles/colour-binary-0005" className={styles.difficultyBtn}>
          Easy
        </Link>
        <Link to="/puzzles/colour-binary-0006" className={styles.difficultyBtn}>
          Medium
        </Link>
        <Link to="/puzzles/colour-binary-0007" className={styles.difficultyBtn}>
          Hard
        </Link>
      </div>
    </div>
  );
}

function ComingSoonCard({ title, summary }: { title: string; summary: string }) {
  return (
    <div className={styles.puzzleCard}>
      <span className={styles.comingSoonBadge}>Coming Soon</span>
      <h3 className={styles.puzzleName}>{title}</h3>
      <p className={styles.puzzleSummary}>{summary}</p>
    </div>
  );
}

export function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Puzzle Collection</h1>
        <p className={styles.subtitle}>Explore our mind-bending challenges</p>
      </header>

      <section>
        <h2 className={styles.puzzleHeading}>Puzzle types</h2>

        <div className={styles.puzzleGrid}>
          <ColourBinaryCard />
          <ComingSoonCard
            title="Guzzle"
            summary="Find four words that cross at one letter. The colors tell you where each letter goes."
          />
          <ComingSoonCard
            title="Lanterns"
            summary="Lit lanterns tell the truth, dark lanterns lie."
          />
        </div>
      </section>
    </div>
  );
}
