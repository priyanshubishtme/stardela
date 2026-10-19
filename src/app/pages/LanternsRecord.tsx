import type { LanternDifficulty } from "../puzzle-types/lanterns/puzzle";
import styles from "./LanternsPage.module.css";

type RecordData = {
  played: number;
  wins: number;
  correct: number;
  total: number;
  best: Record<LanternDifficulty, number>;
};

/** Show saved performance only after the first completed round. */
export function LanternsRecord({ stats }: { stats: RecordData }) {
  if (stats.played === 0) {
    return <p className={styles.recordEmpty}>Choose a difficulty to begin your first round.</p>;
  }
  return (
    <section className={styles.record} aria-label="Your Lanterns record">
      <div>
        <strong>{stats.played}</strong>
        <span>Rounds played</span>
      </div>
      <div>
        <strong>{stats.wins}</strong>
        <span>Rounds passed</span>
      </div>
      <div>
        <strong>{stats.total ? Math.round((stats.correct / stats.total) * 100) : 0}%</strong>
        <span>Accuracy</span>
      </div>
      <p>
        Personal best <span>Easy {stats.best.easy}</span>
        <span>Medium {stats.best.medium}</span>
        <span>Hard {stats.best.hard}</span>
        <span>Tough {stats.best.tough}</span>
      </p>
    </section>
  );
}
