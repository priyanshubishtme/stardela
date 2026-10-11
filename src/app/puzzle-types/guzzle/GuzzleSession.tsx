/**
 * Playable Guzzle game session component.
 * Host rules sidebar, color legend, interactive board, and reset toolbar.
 */

import { text } from "../../../text/en";
import { type GuzzlePuzzle, isBoardSolved } from "./puzzles";
import { GuzzleBoard, type GuzzleMode } from "./Board";
import { useGuzzleSession } from "./useGuzzleSession";
import styles from "./GuzzleSession.module.css";

/**
 * Props for the GuzzleSession component.
 */
export interface GuzzleSessionProps {
  puzzle: GuzzlePuzzle;
}

/**
 * Sidebar card explaining the rules.
 */
function RulesCard() {
  const guzzleRules = text.guzzle.rules;

  return (
    <aside className={styles.rulesCard} aria-labelledby="guzzle-rules-heading">
      <div className={styles.rulesHeader}>
        <h2 id="guzzle-rules-heading" className={styles.rulesTitle}>
          RULES
        </h2>
      </div>
      <ol className={styles.rulesList}>
        {guzzleRules.map((rule, idx) => (
          <li key={rule} className={styles.ruleItem}>
            <span className={styles.ruleNumber}>{idx + 1}.</span>
            <span className={styles.ruleText}>{rule}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/**
 * Bottom toolbar with reset button and solved announcement.
 */
function GuzzleToolbar({
  onReset,
  isSolved,
  mode,
  mistakes,
}: {
  onReset: () => void;
  isSolved: boolean;
  mode: GuzzleMode;
  mistakes: number;
}) {
  return (
    <>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={onReset}
          aria-label={text.guzzle.resetButton}
        >
          {text.guzzle.resetButton}
        </button>
      </div>

      {isSolved && (
        <p aria-live="polite" className="visually-hidden">
          {`Result: ${mode}, ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`}
        </p>
      )}
    </>
  );
}

/**
 * Main Guzzle game session component.
 */
export default function GuzzleSession({ puzzle }: GuzzleSessionProps) {
  const {
    cells,
    selectedIndex,
    mistakes,
    usedBankLetters,
    mode,
    setMode,
    handleCellClick,
    placeLetter,
    handleReset,
  } = useGuzzleSession(puzzle);

  const solved = isBoardSolved(cells);

  return (
    <div className={styles.layout}>
      <RulesCard />

      <section className={styles.playArea} aria-label={text.guzzle.boardLabel}>
        <GuzzleBoard
          puzzle={puzzle}
          cells={cells}
          selectedIndex={selectedIndex}
          mistakes={mistakes}
          usedBankLetters={usedBankLetters}
          mode={mode}
          onModeChange={setMode}
          onCellClick={handleCellClick}
          onBankLetterClick={placeLetter}
        />

        <GuzzleToolbar onReset={handleReset} isSolved={solved} mode={mode} mistakes={mistakes} />
      </section>
    </div>
  );
}
