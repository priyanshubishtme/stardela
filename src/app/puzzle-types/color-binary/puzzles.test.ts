import { describe, expect, it } from "vitest";
import { difficulties, isDifficulty } from "../../../shared/difficulty";
import { sizes, toRows, toSquares, type Square } from "./puzzles";

describe("difficulty", () => {
  it("defines standard difficulties", () => {
    expect(difficulties).toEqual(["easy", "medium", "hard"]);
  });

  it("validates difficulty values", () => {
    expect(isDifficulty("easy")).toBe(true);
    expect(isDifficulty("medium")).toBe(true);
    expect(isDifficulty("hard")).toBe(true);
    expect(isDifficulty("expert")).toBe(false);
    expect(isDifficulty(123)).toBe(false);
  });
});

describe("color-binary puzzles", () => {
  it("has correct grid sizes for difficulties", () => {
    expect(sizes.easy).toBe(4);
    expect(sizes.medium).toBe(6);
    expect(sizes.hard).toBe(8);
  });

  it("converts rows to flat square array", () => {
    const rows = ["R.B.", ".B.R", "B.R.", ".R.B"];
    const squares = toSquares(rows);
    expect(squares).toHaveLength(16);
    expect(squares[0]).toBe("R");
    expect(squares[1]).toBe(".");
    expect(squares[2]).toBe("B");
    expect(squares[3]).toBe(".");
  });

  it("converts flat squares back to row strings", () => {
    const originalRows = ["R.B.", ".B.R", "B.R.", ".R.B"];
    const squares: Square[] = toSquares(originalRows);
    const convertedRows = toRows(squares);
    expect(convertedRows).toEqual(originalRows);
  });
});
