import { useState } from "react";
import { Link } from "react-router";
import type { LanternDifficulty } from "../puzzle-types/lanterns/puzzle";
import { LanternIllustration } from "../puzzle-types/lanterns/LanternIllustration";
import { LanternsSession } from "../puzzle-types/lanterns/LanternsSession";
import styles from "./LanternsPage.module.css";
import { LanternsRecord } from "./LanternsRecord";
import { LanternsGuide } from "./LanternsGuide";

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
const modes: { id: LanternDifficulty; summary: string; detail: string }[] = [
  {
    id: "easy",
    summary: "Easy",
    detail: "Build confidence with clear facts and direct number clues.",
  },
  {
    id: "medium",
    summary: "Medium",
    detail: "Connect related facts across a few reasoning steps.",
  },
  { id: "hard", summary: "Hard", detail: "Use multi-step maths and careful analysis." },
  { id: "tough", summary: "Tough", detail: "Solve layered logic and advanced maths clues." },
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
      <LanternIllustration id="welcome" className={styles.landingLantern} />
      <p className={styles.eyebrow}>
        STARDELA <span aria-hidden="true">/</span> LOGIC PUZZLE
      </p>
      <h1>Lanterns</h1>
      <p className={styles.intro}>
        Read each statement and mark it true or false. Your score appears after the final lantern.
      </p>
      <div className={styles.challengeMeta} aria-label="Round rules">
        <span>
          <strong>10</strong> clues per round
        </span>
        <span>
          <strong>7</strong> correct to pass
        </span>
      </div>
      <LanternsRecord stats={stats} />
      <div className={styles.buttons}>
        <button type="button" onClick={onPlay}>
          Start a round
        </button>
        <button type="button" className={styles.secondary} onClick={onRules}>
          How to play
        </button>
      </div>
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
    <section className={`${styles.panel} ${styles.difficultyPanel}`}>
      <div className={styles.menuHeading}>
        <p className={styles.menuEyebrow}>SET YOUR PACE</p>
        <h1>Choose your challenge</h1>
        <p className={styles.menuIntro}>
          Choose a level to set the clue difficulty. Each round selects 10 unique lanterns from a
          bank of 20.
        </p>
      </div>
      <div className={styles.modes}>
        {modes.map((mode, index) => (
          <button
            key={mode.id}
            type="button"
            aria-pressed={difficulty === mode.id}
            className={difficulty === mode.id ? styles.modeSelected : styles.mode}
            onClick={() => onSelect(mode.id)}
          >
            <span className={styles.modeNumber}>0{index + 1} / LEVEL</span>
            <strong>{mode.summary}</strong>
            <span className={styles.modeDetail}>{mode.detail}</span>
          </button>
        ))}
      </div>
      <div className={styles.menuActions}>
        <button type="button" onClick={onStart}>
          Start {difficulty} challenge
        </button>
        <button type="button" className={styles.secondary} onClick={onRules}>
          How to play
        </button>
      </div>
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
      {screen === "rules" && <LanternsGuide onChoose={onChoose} />}
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
      <div className={styles.sky} aria-hidden="true"></div>
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
