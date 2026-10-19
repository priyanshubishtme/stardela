import { createLanternBank } from "../LanternBank";
import type { Lantern } from "../puzzle";

/** Store the independent Tough clues for the Lanterns bank. */
const toughFacts: readonly Omit<Lantern, "id" | "difficulty">[] = [
  {
    category: "logic",
    statement: "If exactly one of A and B is true, and A is false, then B is true.",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "The exclusive choice requires one true statement. Since A is false, B must be true.",
  },
  {
    category: "mathematics",
    statement: "A two-digit number with digit sum 9 is divisible by 9.",
    statementType: "independent",
    correctState: "lit",
    explanation: "A number is divisible by 9 when its digit sum is divisible by 9.",
  },
  {
    category: "logic",
    statement:
      "The converse of 'If it rains, the ground gets wet' is 'If the ground is wet, it rained.'",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "The converse swaps the condition and result. It does not claim the converse is true.",
  },
  {
    category: "mathematics",
    statement: "The least common multiple of 12 and 18 is 36.",
    statementType: "independent",
    correctState: "lit",
    explanation: "36 is the smallest positive number divisible by both 12 and 18.",
  },
  {
    category: "mathematics",
    statement: "A 3 by 3 magic square using 1 through 9 has center value 5.",
    statementType: "independent",
    correctState: "lit",
    explanation: "In the normal 3 by 3 magic square, opposite pairs sum to 10 around the center 5.",
  },
  {
    category: "science",
    statement:
      "If an object's velocity changes direction, its acceleration is nonzero during that change.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Velocity includes direction. A change in direction is a change in velocity.",
  },
  {
    category: "mathematics",
    statement:
      "The probability of two independent fair coin flips both being heads is one quarter.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The probabilities multiply: one half times one half equals one quarter.",
  },
  {
    category: "logic",
    statement: "If all Zorps are Mips and no Mips are Lats, then no Zorps are Lats.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Every Zorp belongs to the Mip group, which has no overlap with Lats.",
  },
  {
    category: "mathematics",
    statement: "The next number in 1, 1, 2, 3, 5, 8 is 13 under the Fibonacci rule.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Each term is the sum of the prior two: 5 + 8 = 13.",
  },
  {
    category: "mathematics",
    statement: "A 5-sided polygon has interior angle sum 540 degrees.",
    statementType: "independent",
    correctState: "lit",
    explanation: "(5 - 2) x 180 = 540 degrees.",
  },
  {
    category: "technology",
    statement: "In a comparison sort, the worst-case lower bound is Omega(n log n).",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "Comparison sorting requires at least order n log n comparisons in the general case.",
  },
  {
    category: "mathematics",
    statement: "If x + y = 10 and x - y = 2, then x equals 6.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Adding the equations gives 2x = 12, so x = 6.",
  },
  {
    category: "science",
    statement: "In a series circuit, the same current passes through each component.",
    statementType: "independent",
    correctState: "lit",
    explanation: "A series circuit has one path for charge flow.",
  },
  {
    category: "logic",
    statement: "A statement and its contrapositive have the same truth value.",
    statementType: "independent",
    correctState: "lit",
    explanation: "If P implies Q, then not Q implies not P is logically equivalent.",
  },
  {
    category: "mathematics",
    statement: "The sum of the interior angles of a 12-sided polygon is 1800 degrees.",
    statementType: "independent",
    correctState: "lit",
    explanation: "(12 - 2) x 180 = 1800 degrees.",
  },
  {
    category: "science",
    statement: "An object can have zero velocity and nonzero acceleration at the same instant.",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "At the top of a vertical throw, velocity is momentarily zero while gravity still accelerates it.",
  },
  {
    category: "mathematics",
    statement: "The product of two negative integers is negative.",
    statementType: "independent",
    correctState: "dark",
    explanation: "The product of two negative numbers is positive.",
  },
  {
    category: "logic",
    statement: "If some A are B, then all A are B.",
    statementType: "independent",
    correctState: "dark",
    explanation: "Some members do not imply that every member belongs to the group.",
  },
];

export const toughLanterns: readonly Lantern[] = createLanternBank(toughFacts, "tough");
