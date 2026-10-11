/**
 * Guzzle Board component.
 * Render the interactive grid with letter cells, result feedback (green/yellow/red),
 * letter bank, and mode selector ("With bank" / "Without bank").
 */

import { type CSSProperties } from "react";
import { text } from "../../../text/en";
import { type GuzzleCell, type GuzzlePuzzle, isBoardSolved, getLinesForCell } from "./puzzles";
import styles from "./Board.module.css";

type GridStyle = CSSProperties & { "--size": number };

export type GuzzleMode = "With bank" | "Without bank";

/**
 * Props for the GuzzleBoard component.
 */
export interface GuzzleBoardProps {
  puzzle: GuzzlePuzzle;
  cells: readonly GuzzleCell[];
  selectedIndex: number | null;
  mistakes: number;
  usedBankLetters: ReadonlySet<string>;
  mode: GuzzleMode;
  onModeChange: (mode: GuzzleMode) => void;
  onCellClick: (index: number) => void;
  onBankLetterClick: (letter: string) => void;
}

/**
 * Get the CSS class for a cell based on its result and selection state.
 */
function getCellClass(
  cell: GuzzleCell,
  index: number,
  selectedIndex: number | null,
  puzzle: GuzzlePuzzle,
): string {
  const classes = [styles.cell];
  const cellLines = getLinesForCell(index, puzzle.size);

  if (cellLines.length === 0) {
    classes.push(styles.cellInert);
    return classes.join(" ");
  }

  if (cell.isFixed) {
    classes.push(styles.cellFixed);
    return classes.join(" ");
  }

  if (index === selectedIndex) {
    classes.push(styles.cellSelected);
  }

  if (cell.result === "correct") {
    classes.push(styles.cellCorrect);
  } else if (cell.result === "elsewhere") {
    classes.push(styles.cellElsewhere);
  } else if (cell.result === "absent") {
    classes.push(styles.cellAbsent);
  }

  return classes.join(" ");
}

/**
 * Letter bank showing available letters to place.
 */
function GuzzleLetterBank({
  bank,
  usedBankLetters,
  onBankLetterClick,
}: {
  bank: readonly string[];
  usedBankLetters: ReadonlySet<string>;
  onBankLetterClick: (letter: string) => void;
}) {
  return (
    <div className={styles.bank} aria-label="Letter bank">
      {bank.map((letter) => {
        const isUsed = usedBankLetters.has(letter);
        const btnClass = [styles.bankLetter, isUsed ? styles.bankLetterUsed : ""]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={`bank-${letter}`}
            type="button"
            className={btnClass}
            aria-label={`Letter ${letter}${isUsed ? ", placed" : ""}`}
            aria-disabled={isUsed}
            onClick={() => onBankLetterClick(letter)}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Grid rendering the interactive puzzle cells.
 */
function GuzzleGrid({
  puzzle,
  cells,
  selectedIndex,
  solved,
  onCellClick,
}: {
  puzzle: GuzzlePuzzle;
  cells: readonly GuzzleCell[];
  selectedIndex: number | null;
  solved: boolean;
  onCellClick: (index: number) => void;
}) {
  const gridStyle: GridStyle = { "--size": puzzle.size };
  const guzzleText = text.guzzle;

  return (
    <div
      className={`${styles.board} ${solved ? styles.boardSolved : ""}`}
      style={gridStyle}
      aria-label={guzzleText.boardLabel}
    >
      {cells.map((cell, index) => {
        const row = Math.floor(index / puzzle.size) + 1;
        const col = (index % puzzle.size) + 1;
        const resultDesc = cell.result ? guzzleText.results[cell.result] : null;

        return (
          <button
            key={`cell-${row}-${col}`}
            type="button"
            className={getCellClass(cell, index, selectedIndex, puzzle)}
            aria-label={guzzleText.cellAria(row, col, cell.letter, resultDesc, cell.isFixed)}
            aria-disabled={cell.isFixed || cell.isLocked}
            onClick={() => onCellClick(index)}
          >
            <span className={styles.cellLetter}>{cell.letter ?? ""}</span>
            {cell.result && !cell.isFixed && (
              <span className={styles.cellSymbol} aria-hidden="true">
                {cell.result === "correct" && guzzleText.symbols.correct}
                {cell.result === "elsewhere" && guzzleText.symbols.elsewhere}
                {cell.result === "absent" && guzzleText.symbols.absent}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Mode switcher for choosing "With bank" vs "Without bank".
 */
function GuzzleModeSwitcher({
  mode,
  onModeChange,
}: {
  mode: GuzzleMode;
  onModeChange: (mode: GuzzleMode) => void;
}) {
  const guzzleText = text.guzzle;

  return (
    <div className={styles.modeSection}>
      <fieldset className={styles.modeSwitcher} aria-label="Game mode">
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "With bank" ? styles.modeBtnActive : ""}`}
          onClick={() => onModeChange("With bank")}
          aria-pressed={mode === "With bank"}
        >
          {guzzleText.mode.withBank}
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "Without bank" ? styles.modeBtnActive : ""}`}
          onClick={() => onModeChange("Without bank")}
          aria-pressed={mode === "Without bank"}
        >
          {guzzleText.mode.withoutBank}
        </button>
      </fieldset>
    </div>
  );
}

/**
 * Render the Guzzle game board with grid, bank, mode selector, and status.
 */
export function GuzzleBoard({
  puzzle,
  cells,
  selectedIndex,
  mistakes,
  usedBankLetters,
  mode,
  onModeChange,
  onCellClick,
  onBankLetterClick,
}: GuzzleBoardProps) {
  const solved = isBoardSolved(cells);

  return (
    <div className={styles.boardContainer}>
      <GuzzleModeSwitcher mode={mode} onModeChange={onModeChange} />

      <p className={styles.mistakes}>
        Mistakes: <span className={styles.mistakesCount}>{mistakes}</span>
      </p>

      <GuzzleGrid
        puzzle={puzzle}
        cells={cells}
        selectedIndex={selectedIndex}
        solved={solved}
        onCellClick={onCellClick}
      />

      {mode === "With bank" && (
        <GuzzleLetterBank
          bank={puzzle.bank}
          usedBankLetters={usedBankLetters}
          onBankLetterClick={onBankLetterClick}
        />
      )}

      <p className={`${styles.statusCard} ${solved ? styles.statusSolved : ""}`}>
        {solved
          ? `Result: ${mode}, ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`
          : mode === "With bank"
            ? "Select a square, then choose a letter from the bank or type on your keyboard."
            : "Select a square, then type a letter on your keyboard."}
      </p>
    </div>
  );
}
