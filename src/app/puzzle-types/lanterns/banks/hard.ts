import { createLanternBank } from "../LanternBank";
import type { Lantern } from "../puzzle";

/** Store the independent Hard clues for the Lanterns bank. */
const hardFacts: readonly Omit<Lantern, "id" | "difficulty">[] = [
  {
    category: "mathematics",
    statement: "A regular hexagon has interior angles that sum to 540 degrees.",
    statementType: "independent",
    correctState: "dark",
    explanation: "A six-sided polygon has angle sum (6 - 2) x 180 = 720 degrees, not 540.",
  },
  {
    category: "science",
    statement: "An object at constant speed must move in a straight line.",
    statementType: "independent",
    correctState: "dark",
    explanation: "An object can move at constant speed on a curved path, such as a circle.",
  },
  {
    category: "mathematics",
    statement: "The square root of 2 is a rational number.",
    statementType: "independent",
    correctState: "dark",
    explanation: "The square root of 2 cannot be written as a ratio of two integers.",
  },
  {
    category: "mathematics",
    statement: "101 is a prime number.",
    statementType: "independent",
    correctState: "lit",
    explanation: "No prime number less than or equal to the square root of 101 divides it.",
  },
  {
    category: "science",
    statement: "One astronomical unit is about 100 million kilometres.",
    statementType: "independent",
    correctState: "dark",
    explanation:
      "One astronomical unit is about 149.6 million kilometres, close to 150 million, not 100 million.",
  },
  {
    category: "history",
    statement: "The Paris Agreement was adopted in 2015.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Countries adopted the Paris Agreement in December 2015.",
  },
  {
    category: "mathematics",
    statement: "A 4 by 4 square grid contains 40 squares.",
    statementType: "independent",
    correctState: "dark",
    explanation:
      "Count by side length: 16 unit squares, 9 of size 2, 4 of size 3, and 1 of size 4. There are 30 squares, not 40.",
  },
  {
    category: "technology",
    statement: "The binary number 1010 represents decimal 12.",
    statementType: "independent",
    correctState: "dark",
    explanation: "In base two, 1010 is 8 + 0 + 2 + 0, which equals decimal 10, not 12.",
  },
  {
    category: "science",
    statement: "A sidereal day on Venus is longer than a Venusian year.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Venus takes about 243 Earth days to rotate and 225 days to orbit the Sun.",
  },
  {
    category: "science",
    statement: "An electron has a positive electric charge.",
    statementType: "independent",
    correctState: "dark",
    explanation: "An electron has a negative electric charge.",
  },
  {
    category: "mathematics",
    statement: "The sum of the first 10 positive integers is 50.",
    statementType: "independent",
    correctState: "dark",
    explanation: "Use n(n+1)/2: 10x11/2 = 55, so the sum is not 50.",
  },
  {
    category: "science",
    statement: "At constant velocity, acceleration is zero.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Acceleration measures change in velocity. Constant velocity does not change.",
  },
  {
    category: "mathematics",
    statement: "The prime factorization of 84 is 2 squared times 3 times 7.",
    statementType: "independent",
    correctState: "lit",
    explanation: "2x2x3x7 equals 84.",
  },
  {
    category: "technology",
    statement: "A SHA-256 digest contains 256 bits.",
    statementType: "independent",
    correctState: "lit",
    explanation: "SHA-256 produces a fixed 256-bit hash value.",
  },
  {
    category: "mathematics",
    statement: "The interior angle sum of a decagon is 1440 degrees.",
    statementType: "independent",
    correctState: "lit",
    explanation: "(10 - 2) x 180 = 1440 degrees.",
  },
  {
    category: "science",
    statement: "A chemical element is defined by its number of protons.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The atomic number is the number of protons in the nucleus.",
  },
  {
    category: "history",
    statement: "The Treaty of Versailles was signed in 1919.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The treaty was signed on 28 June 1919.",
  },
  {
    category: "mathematics",
    statement: "The decimal number 0.125 equals one eighth.",
    statementType: "independent",
    correctState: "lit",
    explanation: "1 divided by 8 is 0.125.",
  },
];

/** Create the Hard bank from its eighteen independent statements and two links. */

export const hardLanterns: readonly Lantern[] = createLanternBank(hardFacts, "hard");
