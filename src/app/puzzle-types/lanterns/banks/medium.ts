import { createLanternBank } from "../LanternBank";
import type { Lantern } from "../puzzle";

/** Store the independent Medium clues for the Lanterns bank. */
const mediumFacts: readonly Omit<Lantern, "id" | "difficulty">[] = [
  {
    category: "mathematics",
    statement: "Zero is an even integer.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Zero is divisible by 2 with no remainder.",
  },
  {
    category: "mathematics",
    statement: "The Roman numeral XIV represents 14.",
    statementType: "independent",
    correctState: "lit",
    explanation: "X is 10 and IV is 4, so XIV is 14.",
  },
  {
    category: "science",
    statement: "Mars has two natural moons.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Mars has two moons: Phobos and Deimos.",
  },
  {
    category: "history",
    statement: "The year 1900 was a leap year in the Gregorian calendar.",
    statementType: "independent",
    correctState: "dark",
    explanation: "A century year is a leap year only if divisible by 400. 1900 is not.",
  },
  {
    category: "technology",
    statement: "HTML is a programming language.",
    statementType: "independent",
    correctState: "dark",
    explanation: "HTML is a markup language. It describes page structure.",
  },
  {
    category: "geography",
    statement: "The Nile River flows into the Mediterranean Sea.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The Nile delta opens into the Mediterranean Sea.",
  },
  {
    category: "mathematics",
    statement: "The cube root of 64 is 4.",
    statementType: "independent",
    correctState: "lit",
    explanation: "4 multiplied by itself three times is 64.",
  },
  {
    category: "general",
    statement: "Tokyo is the capital of Japan.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Tokyo is Japan's capital city.",
  },
  {
    category: "science",
    statement: "DNA usually forms a double helix.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The common DNA structure has two strands in a double helix.",
  },
  {
    category: "history",
    statement: "William Shakespeare wrote Hamlet.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Hamlet is a tragedy by William Shakespeare.",
  },
  {
    category: "mathematics",
    statement: "The next number in 2, 6, 12, 20 is 30.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The terms are 1x2, 2x3, 3x4, 4x5, so the next is 5x6.",
  },
  {
    category: "science",
    statement: "A neutron has no electric charge.",
    statementType: "independent",
    correctState: "lit",
    explanation: "Neutrons are electrically neutral subatomic particles.",
  },
  {
    category: "geography",
    statement: "The Equator passes through Kenya.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The Equator crosses Kenya in East Africa.",
  },
  {
    category: "technology",
    statement: "An IPv4 address contains 32 bits.",
    statementType: "independent",
    correctState: "lit",
    explanation: "IPv4 addresses use four 8-bit octets, for 32 bits total.",
  },
  {
    category: "history",
    statement: "The Berlin Wall fell in 1989.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The border crossings opened in November 1989.",
  },
  {
    category: "mathematics",
    statement: "The median of 3, 8, 10, 15, 20 is 10.",
    statementType: "independent",
    correctState: "lit",
    explanation: "The middle value in this ordered set is 10.",
  },
  {
    category: "science",
    statement: "Light travels faster in water than in a vacuum.",
    statementType: "independent",
    correctState: "dark",
    explanation: "Light reaches its maximum speed in a vacuum and slows in water.",
  },
  {
    category: "general",
    statement: "A standard chessboard has 64 squares.",
    statementType: "independent",
    correctState: "lit",
    explanation: "An 8 by 8 board has 64 squares.",
  },
];

/** Hard clues use multi-step maths and advanced science facts. */

export const mediumLanterns: readonly Lantern[] = createLanternBank(mediumFacts, "medium");
