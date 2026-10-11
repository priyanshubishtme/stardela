/**
 * Playable Guzzle game session.
 * Manage cell selection, letter placement, mistake counting,
 * mode switching ("With bank" / "Without bank"), keyboard typing, and board reset.
 */

import { useState, useCallback, useEffect } from "react";
import { text } from "../../../text/en";
import {
  type GuzzleCell,
  type GuzzlePuzzle,
  createInitialCells,
  evaluateCell,
  getLinesForCell,
  isBoardSolved,
} from "./puzzles";
import { GuzzleBoard, type GuzzleMode } from "./Board";
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
        <span className={styles.rulesIcon}>📋</span>
        <h2 id="guzzle-rules-heading" className={styles.rulesTitle}>
          RULES
        </h2>
      </div>
      <ol className={styles.rulesList}>
        {guzzleRules.map((rule, idx) => (
          <li key={rule} className={styles.ruleItem}>
            <span className={styles.ruleNumber}>{idx + 1}</span>
            <span className={styles.ruleText}>{rule}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/**
 * Colour legend explaining green, yellow, red feedback.
 */
function ColourLegend() {
  return (
    <div className={styles.legend}>
      <span className={styles.legendItem}>
        <span className={`${styles.legendDot} ${styles.legendCorrect}`} />
        Correct (✓)
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.legendDot} ${styles.legendElsewhere}`} />
        Different square (↔)
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.legendDot} ${styles.legendAbsent}`} />
        Not in line (✗)
      </span>
    </div>
  );
}

/**
 * Custom hook to manage the Guzzle game state.
 */
function useGuzzleSession(puzzle: GuzzlePuzzle) {
  const [cells, setCells] = useState<GuzzleCell[]>(() => createInitialCells(puzzle));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [usedBankLetters, setUsedBankLetters] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<GuzzleMode>("With bank");

  /** Place a letter into the currently selected cell */
  const placeLetter = useCallback(
    (letter: string) => {
      if (selectedIndex === null) return;
      const upperLetter = letter.toUpperCase();

      /* In "With bank" mode, don't allow placing already-used bank letters */
      if (mode === "With bank" && usedBankLetters.has(upperLetter)) return;

      const cell = cells[selectedIndex];
      if (!cell || cell.isFixed || cell.isLocked) return;

      const result = evaluateCell(upperLetter, selectedIndex, puzzle);
      const isCorrect = result === "correct";

      setCells((prev) => {
        const next = [...prev];
        next[selectedIndex] = {
          ...next[selectedIndex]!,
          letter: upperLetter,
          result,
          isLocked: isCorrect,
        };
        return next;
      });

      if (!isCorrect) {
        setMistakes((prev) => prev + 1);
      } else {
        /* When correctly placed, mark bank letter as used */
        setUsedBankLetters((prev) => new Set(prev).add(upperLetter));
      }

      setSelectedIndex(null);
    },
    [selectedIndex, mode, usedBankLetters, cells, puzzle],
  );

  /** Handle clicking a cell on the board */
  const handleCellClick = useCallback(
    (index: number) => {
      const cell = cells[index];
      if (!cell) return;
      if (cell.isFixed || cell.isLocked) return;

      /* Check if the cell is on any word line */
      const cellLines = getLinesForCell(index, puzzle.size);
      if (cellLines.length === 0) return;

      setSelectedIndex((prev) => (prev === index ? null : index));
    },
    [cells, puzzle.size],
  );

  /** Handle clicking a letter in the bank */
  const handleBankLetterClick = useCallback(
    (letter: string) => {
      placeLetter(letter);
    },
    [placeLetter],
  );

  /** Clear the currently selected cell if not locked */
  const clearSelectedCell = useCallback(() => {
    if (selectedIndex === null) return;
    const cell = cells[selectedIndex];
    if (!cell || cell.isFixed || cell.isLocked) return;

    setCells((prev) => {
      const next = [...prev];
      next[selectedIndex] = {
        ...next[selectedIndex]!,
        letter: null,
        result: null,
      };
      return next;
    });
  }, [selectedIndex, cells]);

  /** Reset the entire board */
  const handleReset = useCallback(() => {
    setCells(createInitialCells(puzzle));
    setSelectedIndex(null);
    setMistakes(0);
    setUsedBankLetters(new Set());
  }, [puzzle]);

  /** Keyboard typing listener */
  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;

      if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        placeLetter(key);
      } else if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        clearSelectedCell();
      } else if (key === "Escape") {
        e.preventDefault();
        setSelectedIndex(null);
      } else if (key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          if (prev === null) return 0;
          const next = prev - puzzle.size;
          return next >= 0 ? next : prev;
        });
      } else if (key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          if (prev === null) return 0;
          const next = prev + puzzle.size;
          return next < puzzle.size * puzzle.size ? next : prev;
        });
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          if (prev === null) return 0;
          return prev % puzzle.size > 0 ? prev - 1 : prev;
        });
      } else if (key === "ArrowRight") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          if (prev === null) return 0;
          return prev % puzzle.size < puzzle.size - 1 ? prev + 1 : prev;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, placeLetter, clearSelectedCell, puzzle.size]);

  return {
    cells,
    selectedIndex,
    mistakes,
    usedBankLetters,
    mode,
    setMode,
    handleCellClick,
    handleBankLetterClick,
    handleReset,
  };
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
    handleBankLetterClick,
    handleReset,
  } = useGuzzleSession(puzzle);

  const solved = isBoardSolved(cells);

  return (
    <div className={styles.layout}>
      <RulesCard />

      <section className={styles.playArea} aria-label={text.guzzle.boardLabel}>
        <ColourLegend />

        <GuzzleBoard
          puzzle={puzzle}
          cells={cells}
          selectedIndex={selectedIndex}
          mistakes={mistakes}
          usedBankLetters={usedBankLetters}
          mode={mode}
          onModeChange={setMode}
          onCellClick={handleCellClick}
          onBankLetterClick={handleBankLetterClick}
        />

        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
            aria-label="Reset puzzle board"
          >
            {text.guzzle.resetButton}
          </button>
        </div>

        {solved && (
          <p aria-live="polite" className="visually-hidden">
            {`Result: ${mode}, ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`}
          </p>
        )}
      </section>
    </div>
  );
}
