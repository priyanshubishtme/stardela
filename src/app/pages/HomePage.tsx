import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Puzzle Collection</h1>
        <p className={styles.subtitle}>Explore our mind-bending challenges</p>
      </header>

      <section>
        <h2 className={styles.puzzleHeading}>Types Crossword</h2>

        <div className={styles.puzzleGrid}>
          {/* Guzzle */}
          <div className={styles.puzzleCard}>
            <span className={styles.comingSoonBadge}>Coming Soon</span>
            <h3 className={styles.puzzleName}>Guzzle</h3>
            <p className={styles.puzzleSummary}>
              Find four words that cross at one letter. The colors tell you where each letter goes.
            </p>
          </div>

          {/* Lanterns */}
          <div className={styles.puzzleCard}>
            <span className={styles.comingSoonBadge}>Coming Soon</span>
            <h3 className={styles.puzzleName}>Lanterns</h3>
            <p className={styles.puzzleSummary}>Lit lanterns tell the truth, dark lanterns lie.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
