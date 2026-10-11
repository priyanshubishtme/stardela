import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { text } from "../../../text/en";
import { Board } from "./Board";
import type { ColorBinaryPuzzle } from "./puzzles";

const words = text["color-binary"];

const samplePuzzle: ColorBinaryPuzzle = {
  id: "color-binary-0001",
  type: "color-binary",
  difficulty: "easy",
  author: "stardela",
  license: "CC-BY-4.0",
  start: ["R...", "....", "....", "...B"],
  answer: ["RRBB", "BBRR", "RRBB", "BBRR"],
};

describe("Board component", () => {
  it("renders a grid with 16 square buttons for easy difficulty", () => {
    render(<Board puzzle={samplePuzzle} />);
    const board = screen.getByLabelText(words.boardLabel);
    expect(board).toBeDefined();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(16);
  });

  it("cycles an empty square on click through red, blue, and empty", () => {
    render(<Board puzzle={samplePuzzle} />);
    const buttons = screen.getAllByRole("button");
    const emptyCell = buttons[1]!;

    expect(emptyCell.textContent).toBe("");

    fireEvent.click(emptyCell);
    expect(emptyCell.textContent).toBe(words.symbols.R);

    fireEvent.click(emptyCell);
    expect(emptyCell.textContent).toBe(words.symbols.B);

    fireEvent.click(emptyCell);
    expect(emptyCell.textContent).toBe("");
  });

  it("does not change a fixed square when clicked", () => {
    render(<Board puzzle={samplePuzzle} />);
    const buttons = screen.getAllByRole("button");
    const fixedCell = buttons[0]!;

    expect(fixedCell.textContent).toBe(words.symbols.R);
    fireEvent.click(fixedCell);
    expect(fixedCell.textContent).toBe(words.symbols.R);
  });
});

describe("Board component - highlights", () => {
  it("renders a highlighted square when highlightIndex is provided", () => {
    render(<Board puzzle={samplePuzzle} highlightIndex={2} />);
    const buttons = screen.getAllByRole("button");
    const highlightedCell = buttons[2]!;
    expect(highlightedCell.className).toContain("squareHighlighted");
  });
});
