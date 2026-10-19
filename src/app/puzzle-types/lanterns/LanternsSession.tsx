import { useEffect, useMemo, useRef } from "react";
import type { LanternDifficulty, LanternPuzzle, LanternState } from "./puzzle";
import { Board } from "./Board";
import styles from "./LanternsSession.module.css";
import { createLanternPuzzle } from "./puzzle";
import { useLanternSession } from "./useLanternSession";

/** Show the two choices and their true-or-false meanings. */
function AnswerChoices({ onAnswer }: { onAnswer: (state: LanternState) => void }) {
  return (
    <div className={styles.actions} aria-label="Choose the statement classification">
      <button
        type="button"
        className={styles.litChoice}
        aria-label="Lit - true"
        onClick={() => onAnswer("lit")}
      >
        <span aria-hidden="true">{String.fromCodePoint(0x2726)}</span>
        <strong>Lit</strong>
        <small>True</small>
      </button>
      <button
        type="button"
        className={styles.darkChoice}
        aria-label="Dark - false"
        onClick={() => onAnswer("dark")}
      >
        <span aria-hidden="true">{String.fromCodePoint(0x25d0)}</span>
        <strong>Dark</strong>
        <small>False</small>
      </button>
    </div>
  );
}

/** Show one clue and the two answer choices. */
function CluePanel({
  statement,
  category,
  onAnswer,
}: {
  statement: string;
  category: string;
  onAnswer: (state: LanternState) => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if (key === "l") onAnswer("lit");
      if (key === "d") onAnswer("dark");
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onAnswer]);
  return (
    <div className={styles.clue} aria-labelledby="lantern-clue-title">
      <p className={styles.category}>{category.replaceAll("-", " ")}</p>
      <h2 id="lantern-clue-title" ref={heading} tabIndex={-1}>
        {statement}
      </h2>
      <AnswerChoices onAnswer={onAnswer} />
    </div>
  );
}
/** Reveal scores and explanations when all answers are locked. */
function ResultsPanel({
  puzzle,
  answers,
  result,
}: {
  puzzle: LanternPuzzle;
  answers: Readonly<Record<string, LanternState>>;
  result: { correct: number; total: number; percentage: number; passed: boolean };
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section className={styles.result} aria-live="polite">
      <h2 ref={heading} tabIndex={-1}>
        {result.correct === 10
          ? "Perfect score"
          : result.passed
            ? "Challenge complete"
            : "Challenge not passed"}
      </h2>
      <p>
        {result.correct} correct, {result.total - result.correct} incorrect - {result.percentage}%
      </p>
      <p>{result.passed ? "You passed." : "You need 7 correct answers to pass."}</p>
      <ol className={styles.review}>
        {puzzle.lanterns.map((lantern) => {
          const correct = answers[lantern.id] === lantern.correctState;
          return (
            <li key={lantern.id}>
              <strong>
                {lantern.id} - {lantern.correctState === "lit" ? "Lit" : "Dark"} -{" "}
                {lantern.category.replaceAll("-", " ")}
              </strong>{" "}
              - {lantern.statement}
              <br />
              <span>
                {correct ? "Correct." : `Your answer: ${answers[lantern.id]}.`}{" "}
                {lantern.explanation}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Explain the answer choices and the locked-answer rule. */
function Instructions() {
  return (
    <div className={styles.instructions}>
      <strong>How to play</strong>
      <span>Inspect one lantern, then choose Lit for true or Dark for false.</span>
      <span>Your choice locks. Results appear after all ten lanterns.</span>
    </div>
  );
}

/** Show difficulty, remaining clues, and the safe exit action. */
function GameStatus({
  difficulty,
  remaining,
  onExit,
}: {
  difficulty: LanternDifficulty;
  remaining: number;
  onExit: () => void;
}) {
  return (
    <div className={styles.gameActions}>
      <span>
        {difficulty.toUpperCase()} - 70% to pass - {remaining} remaining
      </span>
      <button
        type="button"
        onClick={() => {
          if (window.confirm("Leave this challenge? Your progress will end.")) onExit();
        }}
      >
        Exit challenge
      </button>
    </div>
  );
}

/** Show score review and the next-round action after completion. */
function RoundEnd({
  puzzle,
  answers,
  result,
  onRestart,
}: {
  puzzle: LanternPuzzle;
  answers: Readonly<Record<string, LanternState>>;
  result: NonNullable<ReturnType<typeof useLanternSession>["result"]>;
  onRestart: () => void;
}) {
  return (
    <>
      <ResultsPanel puzzle={puzzle} answers={answers} result={result} />
      <button type="button" onClick={onRestart}>
        Play again
      </button>
    </>
  );
}

/** Show a clue only while the player is answering it. */
function ActiveClue({ session }: { session: ReturnType<typeof useLanternSession> }) {
  if (!session.selected || session.complete) return null;
  return (
    <CluePanel
      statement={session.selected.statement}
      category={session.selected.category}
      onAnswer={session.answer}
    />
  );
}

/** Show classified lanterns without exposing the live score. */
function RoundProgress({ classified, total }: { classified: number; total: number }) {
  return (
    <>
      <p className={styles.progress} aria-live="polite">
        {classified === total ? "Challenge complete" : `${classified} of ${total} classified`}
      </p>
      <progress
        className={styles.progressTrack}
        aria-label="Lanterns classified"
        max={total}
        value={classified}
      />
    </>
  );
}

/** Show the board, active clue, progress, and final round summary. */
function GameRound({
  difficulty,
  puzzle,
  session,
  onExit,
  onRestart,
}: {
  difficulty: LanternDifficulty;
  puzzle: LanternPuzzle;
  session: ReturnType<typeof useLanternSession>;
  onExit: () => void;
  onRestart: () => void;
}) {
  const classified = Object.keys(session.answers).length;
  return (
    <section className={styles.container} aria-label="Lanterns challenge">
      <Instructions />
      <GameStatus
        difficulty={difficulty}
        remaining={puzzle.selectionCount - classified}
        onExit={onExit}
      />
      <RoundProgress classified={classified} total={puzzle.selectionCount} />
      <Board
        lanterns={puzzle.lanterns}
        answers={session.answers}
        selectedId={session.selected?.id ?? null}
        onInspect={session.inspect}
      />
      <ActiveClue session={session} />
      {session.result && (
        <RoundEnd
          puzzle={puzzle}
          answers={session.answers}
          result={session.result}
          onRestart={onRestart}
        />
      )}
    </section>
  );
}

/** Render the Lanterns challenge and keep feedback hidden until the end. */
export function LanternsSession({
  difficulty = "easy",
  onExit,
  onRestart,
  onComplete,
}: {
  difficulty?: LanternDifficulty;
  onExit: () => void;
  onRestart: () => void;
  onComplete?: (result: { correct: number; total: number; passed: boolean }) => void;
}) {
  const puzzle = useMemo(() => createLanternPuzzle(difficulty), [difficulty]);
  const session = useLanternSession(puzzle);
  const reported = useRef(false);
  useEffect(() => {
    if (session.result && !reported.current) {
      reported.current = true;
      onComplete?.(session.result);
    }
  }, [session.result, onComplete]);
  return (
    <GameRound
      difficulty={difficulty}
      puzzle={puzzle}
      session={session}
      onExit={onExit}
      onRestart={onRestart}
    />
  );
}
