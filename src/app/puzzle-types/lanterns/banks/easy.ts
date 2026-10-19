import { createLanternBank } from "../LanternBank";
import type { Lantern } from "../puzzle";

/** Store the independent Easy clues for the Lanterns bank. */
const easyFacts: readonly Omit<Lantern, "id" | "difficulty">[] = [
  {
    category: "mathematics",
    statement: "The sum of the first five positive integers is 15.",
    statementType: "independent",
    correctState: "lit",
    explanation: "1 + 2 + 3 + 4 + 5 = 15.",
  },
  {
    category: "science",
    statement: "Water freezes at 0 degrees Celsius at standard pressure.",
    statementType: "independent",
    correctState: "lit",
    explanation: "At standard atmospheric pressure, pure water freezes at 0 degrees Celsius.",
  },
  {
    category: "history",
    statement: "The first crewed Moon landing took place in 1969.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Apollo 11 landed on the Moon in July 1969.",
  },
  {
    category: "technology",
    statement: "A binary digit can have the value 0 or 1.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Binary uses two symbols: 0 and 1.",
  },
  {
    category: "mathematics",
    statement: "21 is a prime number.",
    statementType: "independent",
    correctState: "dark",
    explanation: "21 is divisible by 3 and 7, so it is not prime.",
  },
  {
    category: "science",
    statement: "Sound travels through a vacuum.",
    statementType: "independent",
    correctState: "dark",
    explanation: "Sound needs a medium, such as air, water, or a solid.",
  },
  {
    category: "general",
    statement: "A triangle has three sides.",
    statementType: "independent",
    correctState: "lit",
    explanation: "A triangle is a polygon with three sides.",
  },
  {
    category: "geography",
    statement: "The Pacific Ocean is larger than the Atlantic Ocean.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The Pacific is the largest ocean on Earth.",
  },
  {
    category: "mythological",
    statement: "In Greek mythology, Zeus is associated with thunder.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Zeus is the Greek god of the sky and thunder.",
  },
  {
    category: "mathematics",
    statement: "The square of 12 is 144.",
    statementType: "independent",
    correctState: "lit",
    explanation: "12 × 12 = 144.",
  },
  {
    category: "general",
    statement: "A week has eight days.",
    statementType: "independent",
    correctState: "dark",
    explanation: "A week has seven days.",
  },
  {
    category: "science",
    statement: "Earth orbits the Sun.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Earth travels around the Sun once each year.",
  },
  {
    category: "history",
    statement: "The French Revolution began in 1789.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The French Revolution began in 1789.",
  },
  {
    category: "technology",
    statement: "A keyboard is an input device.",
    statementType: "independent",
    correctState: "lit",
    explanation: "A keyboard sends user input to a computer.",
  },
  {
    category: "mathematics",
    statement: "Zero is greater than one.",
    statementType: "independent",
    correctState: "dark",
    explanation: "Zero is less than one.",
  },
  {
    category: "random",
    statement: "A standard six-sided die has six faces.",
    statementType: "independent",
    correctState: "lit",
    explanation: "A standard die has six faces, numbered one through six.",
  },
  {
    category: "science",
    statement: "Plants use light during photosynthesis.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Plants use light energy to make sugars during photosynthesis.",
  },
  {
    category: "general",
    statement: "The Sun is a planet.",
    statementType: "independent",
    correctState: "dark",
    explanation: "The Sun is a star, not a planet.",
  },
  {
    category: "logic",
    statement: "If all squares are rectangles, then every square is a rectangle.",
    statementType: "independent",
    correctState: "lit",
    explanation: "This repeats the stated condition, so it is true.",
  },
  {
    category: "mythological",
    statement: "In Norse mythology, Thor carries a hammer called Mjolnir.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Mjolnir is Thor's hammer in Norse mythology.",
  },
];

/** The initial verified set contains twenty easy statements. */

export const easyLanterns: readonly Lantern[] = createLanternBank(easyFacts, "easy");
