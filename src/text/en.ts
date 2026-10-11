const siteName = "Skardela";

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
  footer: {
    content: "© 2026 Skardela. All rights reserved.",
  },
  routeError: {
    title: "Something went wrong",
    body: "An error stopped this page. Reload the page to try again.",
    homeLink: "Go to the home page",
  },
};
