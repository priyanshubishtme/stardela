/**
 * Playable Color Binary game session.
 * Manages player moves, hint highlights, board reset, and rule checks.
 */

import { useState } from "react";
import { text } from "../../../text/en";
import { Board } from "./Board";
import { findHint } from "./hint";
import { toSquares, type ColorBinaryPuzzle, type Square } from "./puzzles";
import styles from "./ColorBinarySession.module.css";

const words = text["color-binary"];

/**
 * Props for the ColorBinarySession component.
 */
export interface ColorBinarySessionProps {
  puzzle: ColorBinaryPuzzle;
}

/**
 * Card explaining the game rules to the player.
 */
function RulesCard() {
  return (
    <aside className={styles.rulesCard} aria-labelledby="rules-heading">
      <div>
        <div className={styles.rulesHeader}>
          <span className={styles.rulesIcon}>📜</span>
          <h2 id="rules-heading" className={styles.rulesTitle}>
            RULES
          </h2>
        </div>
        <ol className={styles.rulesList}>
          {words.rules.map((rule, idx) => (
            <li key={rule} className={styles.ruleItem}>
              <span className={styles.ruleNumber}>{idx + 1}</span>
              <span className={styles.ruleText}>{rule}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.rulesTip}>
        <div className={styles.rulesTipTitle}>💡 Strategy Tip</div>
        <span>
          Look for pairs of the same colour — the adjacent square must be the opposite colour.
        </span>
      </div>
    </aside>
  );
}

/**
 * Action toolbar with Hint and Reset buttons.
 */
function ActionToolbar({
  onHint,
  onReset,
  hintMessage,
}: {
  onHint: () => void;
  onReset: () => void;
  hintMessage: string | null;
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.hintBtn} onClick={onHint}>
          {words.hintButton}
        </button>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={onReset}
          aria-label="Reset puzzle board"
        >
          Reset
        </button>
      </div>

      {hintMessage && (
        <output className={styles.hintMessage}>
          <span className={styles.hintMessageIcon}>💡</span>
          <p className={styles.hintMessageText}>{hintMessage}</p>
        </output>
      )}
    </div>
  );
}

/**
 * Custom hook to manage board square state, hint calculation, and reset actions.
 */
function useGameSession(puzzle: ColorBinaryPuzzle) {
  const [squares, setSquares] = useState<Square[]>(() => toSquares(puzzle.start));
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const handleSquareClick = (index: number) => {
    const startSquares = toSquares(puzzle.start);
    if (startSquares[index] !== ".") return;

    setSquares((prev) => {
      const next = [...prev];
      const cur = next[index] ?? ".";
      next[index] = cur === "." ? "R" : cur === "R" ? "B" : ".";
      return next;
    });
    setHintMessage(null);
    setHighlightIndex(null);
  };

  const handleHint = () => {
    const found = findHint(squares);
    if (found) {
      const size = Math.sqrt(squares.length);
      setHintMessage(words.hint(found));
      setHighlightIndex((found.row - 1) * size + (found.column - 1));
    } else {
      setHintMessage(words.noHint);
      setHighlightIndex(null);
    }
  };

  const handleReset = () => {
    setSquares(toSquares(puzzle.start));
    setHintMessage(null);
    setHighlightIndex(null);
  };

  return { squares, hintMessage, highlightIndex, handleSquareClick, handleHint, handleReset };
}

/**
 * Main game session component with interactive board and rules validation.
 */
export default function ColorBinarySession({ puzzle }: ColorBinarySessionProps) {
  const { squares, hintMessage, highlightIndex, handleSquareClick, handleHint, handleReset } =
    useGameSession(puzzle);

  return (
    <div className={styles.layout}>
      <RulesCard />

      <section className={styles.playArea} aria-label={words.boardLabel}>
        <Board
          puzzle={puzzle}
          squares={squares}
          highlightIndex={highlightIndex}
          onSquareClick={handleSquareClick}
        />
        <ActionToolbar onHint={handleHint} onReset={handleReset} hintMessage={hintMessage} />
      </section>
    </div>
  );
}
