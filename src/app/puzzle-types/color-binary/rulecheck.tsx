import type { Square } from "./puzzles";
import styles from "./RuleCheck.module.css";
import { checkRulesAreFollowed } from "./rules-check";

interface RuleFeedbackProps {
  isFollowed: boolean;
  isComplete: boolean;
  violations: string[];
}

function RuleFeedback({ isFollowed, isComplete, violations }: RuleFeedbackProps) {
  if (!isFollowed) {
    return (
      <>
        <p className={styles.statusError}>Rule violation detected</p>
        <ul className={styles.violationsList}>
          {violations.map((violation) => (
            <li key={violation} className={styles.violationItem}>
              {violation}
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (isComplete) {
    return <p className={styles.statusOk}>All rules followed! Puzzle solved.</p>;
  }

  return <p className={styles.statusPending}>All rules followed so far. Keep going!</p>;
}

export interface RuleCheckProps {
  squares: readonly Square[];
  className?: string;
}

export function RuleCheck({ squares, className }: RuleCheckProps) {
  const { isFollowed, isComplete, violations } = checkRulesAreFollowed(squares);
  const containerClass = [styles.container, className].filter(Boolean).join(" ");

  return (
    <section className={containerClass} aria-label="Rule check status">
      <h3 className={styles.heading}>Rule Check</h3>
      <RuleFeedback isFollowed={isFollowed} isComplete={isComplete} violations={violations} />
    </section>
  );
}
