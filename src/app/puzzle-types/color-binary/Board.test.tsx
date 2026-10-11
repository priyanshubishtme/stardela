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
  author: "skardela",
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
    // Square 1,2 is at index 1 and starts empty
    const buttons = screen.getAllByRole("button");
    const emptyCell = buttons[1]!;

    expect(emptyCell.textContent).toBe("");

    // Click 1: turns Red
    fireEvent.click(emptyCell);
    expect(emptyCell.textContent).toBe(words.symbols.R);

    // Click 2: turns Blue
    fireEvent.click(emptyCell);
    expect(emptyCell.textContent).toBe(words.symbols.B);

    // Click 3: turns Empty
    fireEvent.click(emptyCell);
    expect(emptyCell.textContent).toBe("");
  });

  it("does not change a fixed square when clicked", () => {
    render(<Board puzzle={samplePuzzle} />);
    const buttons = screen.getAllByRole("button");
    // Starts with "R"
    const fixedCell = buttons[0]!;

    expect(fixedCell.textContent).toBe(words.symbols.R);
    fireEvent.click(fixedCell);
    expect(fixedCell.textContent).toBe(words.symbols.R);
  });
});
