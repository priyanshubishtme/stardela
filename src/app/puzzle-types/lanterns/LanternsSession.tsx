import { useEffect, useMemo, useRef, useState } from "react";
import type { LanternDifficulty, LanternPuzzle, LanternState } from "./puzzle";
import { Board } from "./Board";
import { LanternsAnswerDialog } from "./LanternsAnswerDialog";
import styles from "./LanternsSession.module.css";
import { createLanternPuzzle } from "./puzzle";
import { useLanternSession } from "./useLanternSession";

type Result = { correct: number; total: number; percentage: number; passed: boolean };

/** Show one clear explanation for a classified lantern. */
function ReviewItem({
  lantern,
  answer,
}: {
  lantern: LanternPuzzle["lanterns"][number];
  answer: LanternState;
}) {
  const correct = answer === lantern.correctState;
  return (
    <li>
      <strong>
        {correct ? "Correct" : "Incorrect"} - {lantern.category.replaceAll("-", " ")}
      </strong>
      <p>{lantern.statement}</p>
      <span>
        Correct answer: <b>{lantern.correctState === "lit" ? "Lit - true" : "Dark - false"}</b>.
        Your answer: <b>{answer === "lit" ? "Lit" : "Dark"}</b>.
      </span>
      <span>
        <b>Why:</b> {lantern.explanation}
      </span>
    </li>
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
  result: Result;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const headingText =
    result.correct === 10
      ? "Perfect score"
      : result.passed
        ? "Challenge complete"
        : "Challenge not passed";
  return (
    <section className={styles.result} aria-live="polite">
      <h2 ref={heading} tabIndex={-1}>
        {headingText}
      </h2>
      <p>
        {result.correct} correct, {result.total - result.correct} incorrect - {result.percentage}%
      </p>
      <p>{result.passed ? "You passed." : "You need 7 correct answers to pass."}</p>
      <ol className={styles.review}>
        {puzzle.lanterns
          .filter((lantern) => answers[lantern.id])
          .map((lantern) => (
            <ReviewItem key={lantern.id} lantern={lantern} answer={answers[lantern.id]!} />
          ))}
      </ol>
    </section>
  );
}

/** Celebrate or explain the result before the detailed review. */
function ResultDialog({ result, onReview }: { result: Result; onReview: () => void }) {
  return (
    <div className={styles.resultBackdrop}>
      <dialog
        open
        className={`${styles.resultDialog} ${result.passed ? styles.resultWin : styles.resultLoss}`}
        aria-labelledby="round-result-title"
      >
        <span className={styles.resultMark} aria-hidden="true">
          {result.passed ? "*" : "o"}
        </span>
        <p>{result.passed ? "ROUND COMPLETE" : "ROUND ENDED"}</p>
        <h2 id="round-result-title">
          {result.passed ? "You passed the challenge" : "Challenge not passed"}
        </h2>
        <strong>
          {result.correct} / {result.total}
        </strong>
        <span>
          {result.percentage}% accuracy -{" "}
          {result.passed
            ? "Seven correct answers are needed to pass."
            : "Review the answers, then try again."}
        </span>
        <button type="button" onClick={onReview}>
          View explanations
        </button>
      </dialog>
    </div>
  );
}

/** Explain the direct answer flow. */
function Instructions() {
  return (
    <div className={styles.instructions}>
      <strong>How to play</strong>
      <span>Open a lantern and choose Lit for true or Dark for false.</span>
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
  result: Result;
  onRestart: () => void;
}) {
  const [showResult, setShowResult] = useState(true);
  if (showResult) return <ResultDialog result={result} onReview={() => setShowResult(false)} />;
  return (
    <>
      <ResultsPanel puzzle={puzzle} answers={answers} result={result} />
      <button type="button" onClick={onRestart}>
        Play again
      </button>
    </>
  );
}

/** Show the statement and both answer choices in one dialog. */
function ActiveClue({ session }: { session: ReturnType<typeof useLanternSession> }) {
  if (!session.selected || session.complete) return null;
  return (
    <LanternsAnswerDialog
      statement={session.selected.statement}
      category={session.selected.category}
      onAnswer={session.answer}
      onClose={session.closeStatement}
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

/** Show the board, direct answer dialog, progress, and final round summary. */
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
        lanterns={session.displayedLanterns}
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
