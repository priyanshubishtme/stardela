import { useState } from "react";
import { Link } from "react-router";
import type { LanternDifficulty } from "../puzzle-types/lanterns/puzzle";
import { LanternsSession } from "../puzzle-types/lanterns/LanternsSession";
import styles from "./LanternsPage.module.css";

type Screen = "welcome" | "rules" | "choose" | "game";
const STATS_KEY = "stardela_lanterns_stats_v1";
type LanternStats = {
  played: number;
  wins: number;
  losses: number;
  correct: number;
  total: number;
  best: Record<LanternDifficulty, number>;
};
const emptyStats: LanternStats = {
  played: 0,
  wins: 0,
  losses: 0,
  correct: 0,
  total: 0,
  best: { easy: 0, medium: 0, hard: 0, tough: 0 },
};

/** Read local results and use an empty record when storage is invalid. */
function readStats(): LanternStats {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STATS_KEY) ?? "null");
    if (typeof value === "object" && value !== null) {
      const record = value as Record<string, unknown>;
      const best = record.best as Record<string, unknown> | null;
      const counts = [record.played, record.wins, record.losses, record.correct, record.total];
      const scores = best && [best.easy, best.medium, best.hard, best.tough];
      if (
        counts.every(
          (count) => typeof count === "number" && Number.isFinite(count) && count >= 0,
        ) &&
        scores &&
        scores.every((score) => typeof score === "number" && Number.isFinite(score) && score >= 0)
      ) {
        return value as LanternStats;
      }
    }
  } catch {
    return emptyStats;
  }
  return emptyStats;
}
const modes: { id: LanternDifficulty; summary: string }[] = [
  { id: "easy", summary: "Clear facts and simple number clues." },
  { id: "medium", summary: "Connect facts and use several reasoning steps." },
  { id: "hard", summary: "Use advanced maths and careful analysis." },
  { id: "tough", summary: "Solve competition style logic and maths clues." },
];

/** Explain the game and link to its instructions or difficulty menu. */
function Welcome({
  onPlay,
  onRules,
  stats,
}: {
  onPlay: () => void;
  onRules: () => void;
  stats: LanternStats;
}) {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>A Stardela logic game</p>
      <h1>Lanterns</h1>
      <p>
        Read the statements hidden in a quiet night sky. Decide which are true and which are false.
      </p>
      <p className={styles.rule}>10 lanterns per round / 7 correct to pass</p>
      <p className={styles.record}>
        {stats.played} played / {stats.wins} passed / {stats.losses} not passed / Accuracy:{" "}
        {stats.total ? Math.round((stats.correct / stats.total) * 100) : 0}%
        <br />
        Best scores (Easy / Medium / Hard / Tough): {stats.best.easy} / {stats.best.medium} /{" "}
        {stats.best.hard} / {stats.best.tough}
      </p>
      <div className={styles.buttons}>
        <button type="button" onClick={onPlay}>
          Play
        </button>
        <button type="button" className={styles.secondary} onClick={onRules}>
          How to play
        </button>
      </div>
    </section>
  );
}

/** Show the answer rules before the player starts a round. */
function Rules({ onChoose }: { onChoose: () => void }) {
  return (
    <section className={styles.panel}>
      <h1>How to play</h1>
      <ol>
        <li>Choose a difficulty. The game selects 10 lanterns from its 20 clue bank.</li>
        <li>Open one lantern to read its statement. Only one statement can be open at a time.</li>
        <li>
          Choose <strong>Lit</strong> if its statement is true or <strong>Dark</strong> if it is
          false.
        </li>
        <li>Your answer locks. You cannot change it or open that lantern again.</li>
        <li>The game hides correctness until you classify all 10 lanterns.</li>
        <li>
          Score at least 7 correct answers to pass. One clue links to another lantern&apos;s
          statement.
        </li>
      </ol>
      <button type="button" onClick={onChoose}>
        Choose a difficulty
      </button>
    </section>
  );
}

/** Let the player choose and start one of the four difficulty modes. */
function DifficultyMenu({
  difficulty,
  onSelect,
  onStart,
  onRules,
}: {
  difficulty: LanternDifficulty;
  onSelect: (value: LanternDifficulty) => void;
  onStart: () => void;
  onRules: () => void;
}) {
  return (
    <section className={styles.panel}>
      <h1>Choose your challenge</h1>
      <p>Each round draws 10 unique lanterns from a bank of 20.</p>
      <div className={styles.modes}>
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            aria-pressed={difficulty === mode.id}
            className={difficulty === mode.id ? styles.modeSelected : styles.mode}
            onClick={() => onSelect(mode.id)}
          >
            <strong>{mode.id.toUpperCase()}</strong>
            <span>{mode.summary}</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={onStart}>
        Start {difficulty} challenge
      </button>
      <button type="button" className={styles.secondary} onClick={onRules}>
        How to play
      </button>
    </section>
  );
}

/** Show one active Lanterns round. */
function GameScreen({
  difficulty,
  round,
  onExit,
  onRestart,
  onComplete,
}: {
  difficulty: LanternDifficulty;
  round: number;
  onExit: () => void;
  onRestart: () => void;
  onComplete: (result: { correct: number; total: number; passed: boolean }) => void;
}) {
  return (
    <section className={styles.game}>
      <h1>Lanterns</h1>
      <LanternsSession
        key={`${difficulty}-${round}`}
        difficulty={difficulty}
        onExit={onExit}
        onRestart={onRestart}
        onComplete={onComplete}
      />
    </section>
  );
}

/** Save score totals and best scores for the current browser. */
function useLanternStats(difficulty: LanternDifficulty) {
  const [stats, setStats] = useState(readStats);
  function recordResult(result: { correct: number; total: number; passed: boolean }) {
    const next: LanternStats = {
      ...stats,
      played: stats.played + 1,
      wins: stats.wins + Number(result.passed),
      losses: stats.losses + Number(!result.passed),
      correct: stats.correct + result.correct,
      total: stats.total + result.total,
      best: { ...stats.best, [difficulty]: Math.max(stats.best[difficulty], result.correct) },
    };
    setStats(next);
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(next));
    } catch {
      // Keep play available when browser storage is disabled.
    }
  }
  return { stats, recordResult };
}

/** Render the active stage of the Lanterns flow. */
function FlowScreen({
  screen,
  difficulty,
  round,
  stats,
  onChoose,
  onSelect,
  onStart,
  onRules,
  onExit,
  onRestart,
  onComplete,
}: {
  screen: Screen;
  difficulty: LanternDifficulty;
  round: number;
  stats: LanternStats;
  onChoose: () => void;
  onSelect: (value: LanternDifficulty) => void;
  onStart: () => void;
  onRules: () => void;
  onExit: () => void;
  onRestart: () => void;
  onComplete: (result: { correct: number; total: number; passed: boolean }) => void;
}) {
  return (
    <>
      <title>Lanterns | Stardela</title>
      {screen === "welcome" && <Welcome stats={stats} onPlay={onChoose} onRules={onRules} />}
      {screen === "rules" && <Rules onChoose={onChoose} />}
      {screen === "choose" && (
        <DifficultyMenu
          difficulty={difficulty}
          onSelect={onSelect}
          onRules={onRules}
          onStart={onStart}
        />
      )}
      {screen === "game" && (
        <GameScreen
          difficulty={difficulty}
          round={round}
          onExit={onExit}
          onRestart={onRestart}
          onComplete={onComplete}
        />
      )}
    </>
  );
}

/** Show the Lanterns game after the player starts a round. */
export function LanternsPage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [difficulty, setDifficulty] = useState<LanternDifficulty>("easy");
  const [round, setRound] = useState(0);
  const { stats, recordResult } = useLanternStats(difficulty);
  return (
    <div className={styles.page}>
      <div className={styles.sky} aria-hidden="true">
        <span>*</span>
        <span>+</span>
        <span>*</span>
        <span>+</span>
      </div>
      <Link className={styles.back} to="/">
        Back to puzzle collection
      </Link>
      <FlowScreen
        screen={screen}
        difficulty={difficulty}
        round={round}
        stats={stats}
        onChoose={() => setScreen("choose")}
        onSelect={setDifficulty}
        onStart={() => {
          setRound((value) => value + 1);
          setScreen("game");
        }}
        onRules={() => setScreen("rules")}
        onExit={() => setScreen("choose")}
        onRestart={() => setRound((value) => value + 1)}
        onComplete={recordResult}
      />
    </div>
  );
}
