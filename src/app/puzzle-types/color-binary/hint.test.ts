import { describe, expect, it } from "vitest";
import { text } from "../../../text/en";
import { brokenRule, findHint } from "./hint";
import { toSquares } from "./puzzles";
import { checkRules } from "./rules-check";

const words = text["color-binary"];

describe("hint: three in a row", () => {
  it("detects when placing a color makes three in a row", () => {
    const squares = toSquares(["B.B.", "....", "....", "...."]);
    const broken = brokenRule(squares, 1, "B");
    expect(broken).toEqual({ reason: "three", line: "row", number: 1 });

    const hint = findHint(squares);
    expect(hint).toEqual({
      row: 1,
      column: 2,
      color: "red",
      otherColor: "blue",
      reason: "three",
      line: "row",
      number: 1,
    });

    expect(words.hint(hint!)).toBe(
      "Row 1, Column 2: blue here makes three blue squares next to each other in Row 1. Thus this square is red.",
    );
  });
});

describe("hint: half line", () => {
  it("detects when a row already has half of its squares of the other color", () => {
    const squares = toSquares(["R..R", "....", "....", "...."]);
    const broken = brokenRule(squares, 1, "R");
    expect(broken).toEqual({ reason: "half", line: "row", number: 1 });

    const hint = findHint(squares);
    expect(hint).toEqual({
      row: 1,
      column: 2,
      color: "blue",
      otherColor: "red",
      reason: "half",
      line: "row",
      number: 1,
    });

    expect(words.hint(hint!)).toBe(
      "Row 1, Column 2: Row 1 already has half of its squares red. Thus this square is blue.",
    );
  });

  it("returns null when no rule-based deduction is available", () => {
    const squares = toSquares(["....", "....", "....", "...."]);
    expect(findHint(squares)).toBeNull();
  });
});

describe("rules-check", () => {
  it("validates a board with no rule violations", () => {
    const validBoard = toSquares(["RBRB", "BRBR", "RBRB", "BRBR"]);
    expect(checkRules(validBoard)).toBe(true);
  });

  it("detects three in a row violation", () => {
    const invalidBoard = toSquares(["RRRB", "....", "....", "...."]);
    expect(checkRules(invalidBoard)).toBe(false);
  });

  it("detects more than half of one color in a row", () => {
    const invalidBoard = toSquares(["RRR.", "....", "....", "...."]);
    expect(checkRules(invalidBoard)).toBe(false);
  });
});
