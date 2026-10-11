import { useState } from "react";
import { useParams } from "react-router";
import { text } from "../../text/en";
import { Board } from "../puzzle-types/color-binary/Board";
import { findHint } from "../puzzle-types/color-binary/hint";
import {
  findColorBinaryPuzzle,
  toSquares,
  type ColorBinaryPuzzle,
  type Square,
} from "../puzzle-types/color-binary/puzzles";
import styles from "./PuzzlePage.module.css";

const words = text["color-binary"];

function PuzzleHeader({ puzzle }: { puzzle: ColorBinaryPuzzle }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{words.name}</h1>
      <div className={styles.badges}>
        <span className={styles.badge}>Level: {puzzle.difficulty}</span>
        <span className={styles.badge}>Puzzle {puzzle.id}</span>
        <span className={styles.badge}>Author: {puzzle.author}</span>
      </div>
    </header>
  );
}

function RulesCard() {
  return (
    <section className={styles.rulesCard} aria-labelledby="rules-heading">
      <h2 id="rules-heading" className={styles.rulesTitle}>
        RULES
      </h2>
      <ol className={styles.rulesList}>
        {words.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
    </section>
  );
}

function ColorBinaryGame({ puzzle }: { puzzle: ColorBinaryPuzzle }) {
  const [squares, setSquares] = useState<Square[]>(() => toSquares(puzzle.start));
  const [hintMessage, setHintMessage] = useState<string | null>(null);

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
  };

  const handleHint = () => {
    const found = findHint(squares);
    setHintMessage(found ? words.hint(found) : words.noHint);
  };

  return (
    <div className={styles.gameLayout}>
      <RulesCard />

      <section className={styles.boardArea} aria-label={words.boardLabel}>
        <Board puzzle={puzzle} squares={squares} onSquareClick={handleSquareClick} />
        <button type="button" className={styles.hintBtn} onClick={handleHint}>
          {words.hintButton}
        </button>
        {hintMessage && <p className={styles.hintMessage}>{hintMessage}</p>}
      </section>
    </div>
  );
}

function FallbackPuzzle({ puzzleId }: { puzzleId?: string }) {
  return (
    <div className={styles.container}>
      <title>{text.puzzlePage.title(puzzleId ?? "Puzzle")}</title>
      <h1>{puzzleId ?? "Puzzle"}</h1>
      <p>Puzzle Page</p>
    </div>
  );
}

export function PuzzlePage() {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const isColorBinary =
    !puzzleId ||
    puzzleId.toLowerCase().includes("color-binary") ||
    puzzleId.toLowerCase().includes("colour-binary");

  if (!isColorBinary) {
    return <FallbackPuzzle puzzleId={puzzleId} />;
  }

  const puzzle = findColorBinaryPuzzle(puzzleId);

  return (
    <div className={styles.container}>
      <title>{text.puzzlePage.title(words.name)}</title>
      <span className="visually-hidden">Puzzle Page</span>
      <PuzzleHeader puzzle={puzzle} />
      <ColorBinaryGame key={puzzle.id} puzzle={puzzle} />
    </div>
  );
}
