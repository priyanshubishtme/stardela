import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toSquares } from "./puzzles";
import { RuleCheck } from "./rulecheck";
import { checkRules, checkRulesAreFollowed, getRuleViolations } from "./rules-check";

describe("rulecheck - validation logic", () => {
  it("detects no violations on a valid solution", () => {
    const valid = toSquares(["BRRB", "RBRB", "RBBR", "BRBR"]);
    const result = checkRulesAreFollowed(valid);

    expect(result.isFollowed).toBe(true);
    expect(result.isComplete).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(checkRules(valid)).toBe(true);
  });

  it("identifies three consecutive squares violation", () => {
    const invalid = toSquares(["RRRB", "....", "....", "...."]);
    const violations = getRuleViolations(invalid);

    expect(violations.some((v) => v.includes("three red squares"))).toBe(true);
    expect(checkRules(invalid)).toBe(false);
  });

  it("identifies line exceeding half of a colour", () => {
    const invalid = toSquares(["RRR.", "....", "....", "...."]);
    const violations = getRuleViolations(invalid);

    expect(violations.some((v) => v.includes("more than half red squares"))).toBe(true);
  });
});

describe("rulecheck - component rendering", () => {
  it("renders status when rules are followed in progress", () => {
    const inProgress = toSquares(["BR..", "....", "....", "...."]);
    render(<RuleCheck squares={inProgress} />);

    expect(screen.getByRole("heading", { name: "Rule Check" })).toBeDefined();
    expect(screen.getByText("All rules followed so far. Keep going!")).toBeDefined();
  });

  it("renders violations when a rule is broken", () => {
    const invalid = toSquares(["BBBR", "....", "....", "...."]);
    render(<RuleCheck squares={invalid} />);

    expect(screen.getByText("Rule violation detected")).toBeDefined();
    expect(screen.getByText("Row 1 has three blue squares next to each other.")).toBeDefined();
  });

  it("renders solved message on complete valid board", () => {
    const solved = toSquares(["BRRB", "RBRB", "RBBR", "BRBR"]);
    render(<RuleCheck squares={solved} />);

    expect(screen.getByText("All rules followed! Puzzle solved.")).toBeDefined();
  });
});
