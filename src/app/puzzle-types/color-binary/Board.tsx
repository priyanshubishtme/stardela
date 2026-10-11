import { type CSSProperties, useState } from "react";
import { text } from "../../../text/en";
import { type ColorBinaryPuzzle, type Square, sizes, toSquares } from "./puzzles";
import styles from "./Board.module.css";

const words = text["color-binary"];

type GridStyle = CSSProperties & { "--size": number };

export interface BoardProps {
  puzzle: ColorBinaryPuzzle;
  squares?: readonly Square[];
  highlightIndex?: number | null;
  onSquareClick?: (index: number) => void;
}

const NEXT_SQUARE: Record<Square, Square> = {
  ".": "R",
  R: "B",
  B: ".",
};

interface SquareButtonProps {
  square: Square;
  index: number;
  size: number;
  isFixed: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
}

function SquareButton({ square, index, size, isFixed, isHighlighted, onClick }: SquareButtonProps) {
  const row = Math.floor(index / size) + 1;
  const col = (index % size) + 1;

  const colorName =
    square === "R" ? words.colors.R : square === "B" ? words.colors.B : words.colors["."];
  const symbol = square === "R" ? words.symbols.R : square === "B" ? words.symbols.B : "";

  const squareClass = [
    styles.square,
    square === "R" ? styles.squareRed : square === "B" ? styles.squareBlue : styles.squareEmpty,
    isFixed ? styles.squareFixed : "",
    isHighlighted ? styles.squareHighlighted : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={squareClass}
      aria-label={words.square({ row, col, color: colorName, isFixed })}
      aria-disabled={isFixed}
      onClick={onClick}
    >
      {symbol}
    </button>
  );
}

interface BoardGridProps {
  squares: readonly Square[];
  startSquares: readonly Square[];
  size: number;
  highlightIndex?: number | null;
  onSquareClick: (index: number) => void;
}

function BoardGrid({ squares, startSquares, size, highlightIndex, onSquareClick }: BoardGridProps) {
  const gridStyle: GridStyle = { "--size": size };
  const cells = squares.map((square, index) => ({
    coordId: `pos-${Math.floor(index / size)}-${index % size}`,
    square,
    index,
    isFixed: startSquares[index] !== ".",
    isHighlighted: highlightIndex === index,
  }));

  return (
    <div className={styles.board} aria-label={words.boardLabel} style={gridStyle}>
      {cells.map(({ coordId, square, index, isFixed, isHighlighted }) => (
        <SquareButton
          key={coordId}
          square={square}
          index={index}
          size={size}
          isFixed={isFixed}
          isHighlighted={isHighlighted}
          onClick={() => onSquareClick(index)}
        />
      ))}
    </div>
  );
}

export function Board({
  puzzle,
  squares: externalSquares,
  highlightIndex,
  onSquareClick,
}: BoardProps) {
  const [internalSquares, setInternalSquares] = useState<Square[]>(() => toSquares(puzzle.start));
  const squares = externalSquares ?? internalSquares;
  const startSquares = toSquares(puzzle.start);
  const size = sizes[puzzle.difficulty];
  const isSolved = squares.join("") === toSquares(puzzle.answer).join("");

  const handleClick = (index: number) => {
    if (startSquares[index] !== ".") return;
    if (onSquareClick) {
      onSquareClick(index);
    } else {
      setInternalSquares((prev) => {
        const next = [...prev];
        const current = next[index] ?? ".";
        next[index] = NEXT_SQUARE[current];
        return next;
      });
    }
  };

  return (
    <div className={styles.container}>
      <BoardGrid
        squares={squares}
        startSquares={startSquares}
        size={size}
        highlightIndex={highlightIndex}
        onSquareClick={handleClick}
      />
      <p className={`${styles.status} ${isSolved ? styles.solved : ""}`}>
        {isSolved ? words.status.solved : words.status.start}
      </p>
    </div>
  );
}
