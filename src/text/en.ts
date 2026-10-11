/**
 * English text and localization dictionary for the application.
 * Provide UI labels, game instructions, and hint messages.
 */

const siteName = "Skardela";

/**
 * Data structure describing a single hint for Color Binary.
 */
export interface ColorBinaryHint {
  row: number;
  column: number;
  color: string;
  otherColor: string;
  reason: "half" | "three";
  line: "row" | "column";
  number: number;
}

/**
 * English vocabulary, instructions, and hint builders for Color Binary.
 */
const colorBinary = {
  name: "Colour Binary",
  summary: "Make each square red or blue. Each line has half of each colour.",
  rules: [
    "Make each square red or blue.",
    "Each row and each column has the same number of red squares and blue squares.",
    "Three squares of the same colour must not be next to each other in a row or a column.",
  ],
  status: {
    start: "Tap a square to make it red. Tap again for blue, and again to make it empty.",
    solved: "You solved the puzzle! Each row and each column obeys the rules.",
  },
  hintButton: "Hint",
  hintbutton: "Hint",
  hint: (hint: ColorBinaryHint) => {
    const line = `${hint.line === "row" ? "Row" : "Column"} ${hint.number}`;
    const why =
      hint.reason === "half"
        ? `${line} already has half of its squares ${hint.otherColor}.`
        : `${hint.otherColor} here makes three ${hint.otherColor} squares next to each other in ${line}.`;
    return `Row ${hint.row}, Column ${hint.column}: ${why} Thus this square is ${hint.color}.`;
  },
  noHint: "No hints available",
  noHInt: "No hints available",
  boardLabel: "Colour Binary Board",
  boardLabels: "Colour Binary Board",
  colors: {
    R: "red",
    B: "blue",
    ".": "empty",
    red: "red",
    blue: "blue",
    empty: "empty",
  },
  symbols: {
    R: "\u25CF",
    B: "\u25AA",
    ".": "",
  },
  sqymbols: {
    R: "\u25CF",
    B: "\u25AA",
    ".": "",
  },
  square: (
    rowOrSquare:
      | number
      | {
          row: number;
          col?: number;
          column?: number;
          color: string;
          isFixed?: boolean;
          isfixed?: boolean;
        },
    col?: number,
    color?: string,
    isFixed?: boolean,
  ) => {
    if (typeof rowOrSquare === "object") {
      const row = rowOrSquare.row;
      const colNum = rowOrSquare.col ?? rowOrSquare.column ?? 0;
      const c = rowOrSquare.color;
      const fixed = rowOrSquare.isFixed ?? rowOrSquare.isfixed ?? false;
      return `Row ${row}, Column ${colNum}, ${c}${fixed ? ", fixed" : ""}`;
    }
    const colNum = col ?? 0;
    const c = color ?? "";
    const fixed = isFixed ?? false;
    return `Row ${rowOrSquare}, Column ${colNum}, ${c}${fixed ? ", fixed" : ""}`;
  },
};

/**
 * English vocabulary, instructions, and messages for Guzzle.
 */
const guzzle = {
  name: "Guzzle",
  summary: "Find four words that cross at one letter. The colors tell you where each letter goes.",
  rules: [
    "Four words cross at the center letter: across, down and two diagonals.",
    "All words have the same length.",
    "Put a letter in a square.",
    "Green: the letter is correct.",
    "Yellow: this line has the letter in a different square.",
    "Red: this line does not have the letter.",
    "Make all squares green with the fewest mistakes.",
  ],
  status: {
    start: "Select a square, then choose a letter from the bank or type on your keyboard.",
    solved: (mode: string, mistakes: number) =>
      `${mode}, ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`,
  },
  mode: {
    withBank: "With bank",
    withoutBank: "Without bank",
    withBankLabel: "Play with letter bank",
    withoutBankLabel: "Play without letter bank (free typing)",
  },
  mistakes: (count: number) => `Mistakes: ${count}`,
  resetButton: "Reset",
  boardLabel: "Guzzle Board",
  symbols: {
    correct: "✓",
    elsewhere: "↔",
    absent: "✗",
  },
  colors: {
    green: "green",
    yellow: "yellow",
    red: "red",
  },
  results: {
    correct: "correct",
    elsewhere: "different square in line",
    absent: "not in line",
  },
  cellAria: (
    row: number,
    col: number,
    letter?: string | null,
    result?: string | null,
    isFixed?: boolean,
  ) => {
    const fixedStr = isFixed ? ", center fixed letter" : "";
    const letterStr = letter ? `, letter ${letter}` : ", empty";
    const resultStr = result ? `, ${result}` : "";
    return `Row ${row}, Column ${col}${letterStr}${resultStr}${fixedStr}`;
  },
};

/**
 * Main localization catalog for English.
 */
export const text = {
  siteName,
  skipLink: "Skip to main content",
  nav: {
    label: "Main",
    home: "Home",
  },
  puzzlePage: {
    title: (title: string = "Puzzle") => `${title} | ${siteName}`,
    loading: "Loading...",
  },
  "color-binary": colorBinary,
  "colour-binary": colorBinary,
  guzzle,
  footer: {
    content: "© 2026 Skardela. All rights reserved.",
  },
  routeError: {
    title: "Something went wrong",
    body: "An error stopped this page. Reload the page to try again.",
    homeLink: "Go to the home page",
  },
};
