import { createLanternBank } from "../LanternBank";
import type { Lantern } from "../puzzle";

/** Store the independent Tough clues for the Lanterns bank. */
const toughFacts: readonly Omit<Lantern, "id" | "difficulty">[] = [
  {
    category: "logic",
    statement: "If exactly one of A and B is true, and A is false, then B is false.",
    statementType: "independent",
    correctState: "dark",
    explanation:
      "Exactly one must be true. Since A is false, B must be true, so the claim that B is false does not hold.",
  },
  {
    category: "mathematics",
    statement: "Every two-digit number with digit sum 9 is odd.",
    statementType: "independent",
    correctState: "dark",
    explanation: "The two-digit number 18 has digit sum 9 and is even, so the claim is false.",
  },
  {
    category: "logic",
    statement: "If it rains, the ground gets wet; therefore, wet ground proves that it rained.",
    statementType: "independent",
    correctState: "dark",
    explanation:
      "This reverses the implication. A sprinkler can make the ground wet, so wet ground does not prove that it rained.",
  },
  {
    category: "mathematics",
    statement: "The least common multiple of 72 and 108 is 216.",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "72 is 2^3 x 3^2 and 108 is 2^2 x 3^3. Use the greatest power of each prime: 2^3 x 3^3 = 216.",
  },
  {
    category: "mathematics",
    statement: "A 3 by 3 magic square using 1 through 9 has center value 4.",
    statementType: "independent",
    correctState: "dark",
    explanation: "The normal 3 by 3 magic square has center 5. Opposite pairs sum to 10 around it.",
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
      "The probability of drawing two aces in a row from a 52-card deck, without replacement, is 1/221.",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "The chance is 4/52 for the first ace, then 3/51 for the second. Their product is 12/2652, which reduces to 1/221.",
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
    statement: "For every integer n, n squared leaves remainder 0 or 1 when divided by 4.",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "If n is even, n squared is divisible by 4. If n is odd, write n as 2k + 1; its square is 4k(k + 1) + 1, with remainder 1.",
  },
  {
    category: "mathematics",
    statement: "For every integer n, n cubed minus n is divisible by 6.",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "n cubed minus n equals (n - 1)n(n + 1). These are three consecutive integers, so their product is divisible by 2 and by 3, and therefore by 6.",
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
    statement:
      "If x + y = 11 and xy = 28 for real x and y, then x and y are 4 and 7 in some order.",
    statementType: "independent",
    correctState: "lit",
    explanation:
      "Treat x and y as roots of t squared - 11t + 28 = 0. It factors as (t - 4)(t - 7), so the roots are 4 and 7.",
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
    statement: "The product of an even number of negative integers is negative.",
    statementType: "independent",
    correctState: "dark",
    explanation:
      "Each pair of negative factors has a positive product. An even number of negative factors makes an even number of pairs, so the total product is positive.",
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
    statement: "If an integer's square is divisible by 12, that integer must be divisible by 12.",
    statementType: "independent",
    correctState: "dark",
    explanation:
      "Six is a counterexample: 6 squared is 36, which is divisible by 12, but 6 is not divisible by 12.",
  },
  {
    category: "logic",
    statement: "If P implies Q and Q is true, then P must be true.",
    statementType: "independent",
    correctState: "dark",
    explanation:
      "This affirms the consequent. Rain can make a road wet, but a wet road does not prove that it rained.",
  },
];

/** Create the Tough bank from its eighteen independent statements and two links. */
export const toughLanterns: readonly Lantern[] = createLanternBank(toughFacts, "tough");
