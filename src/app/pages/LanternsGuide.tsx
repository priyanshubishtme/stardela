import { LanternIllustration } from "../puzzle-types/lanterns/LanternIllustration";
import styles from "./LanternsPage.module.css";

/** Show one illustrated example for each answer state. */
function StateExample({ state }: { state: "lit" | "dark" }) {
  const lit = state === "lit";
  return (
    <div className={styles.stateExample}>
      <LanternIllustration id={`guide-${state}`} className={styles.guideLantern} dimmed={!lit} />
      <strong>{lit ? "Lit" : "Dark"}</strong>
      <span>{lit ? "The statement is true." : "The statement is false."}</span>
    </div>
  );
}

/** Explain the four actions in one round. */
function RuleSteps() {
  return (
    <ol className={styles.ruleSteps}>
      <li>
        <span>01</span>
        <div>
          <strong>Choose a difficulty</strong>
          <p>Each round draws ten unique lanterns from a bank of twenty.</p>
        </div>
      </li>
      <li>
        <span>02</span>
        <div>
          <strong>Inspect one lantern</strong>
          <p>Its category and number stay visible. Select it to reveal the statement.</p>
        </div>
      </li>
      <li>
        <span>03</span>
        <div>
          <strong>Make your choice</strong>
          <p>Lit means true. Dark means false. Your answer locks when you submit it.</p>
        </div>
      </li>
      <li>
        <span>04</span>
        <div>
          <strong>Review the result</strong>
          <p>
            Correct answers and explanations appear after all ten lanterns. Get seven right to pass.
          </p>
        </div>
      </li>
    </ol>
  );
}

/** Show the game rules as a short illustrated sequence. */
export function LanternsGuide({ onChoose }: { onChoose: () => void }) {
  return (
    <section className={`${styles.panel} ${styles.rulesPanel}`}>
      <div className={styles.rulesHero}>
        <LanternIllustration id="guide-header" className={styles.heroLantern} />
        <p className={styles.eyebrow}>A short field guide</p>
        <h1>How to play</h1>
        <p>Read a statement. Decide if it is true. Set its lantern, then move to the next.</p>
      </div>
      <div className={styles.stateExamples}>
        <StateExample state="lit" />
        <StateExample state="dark" />
      </div>
      <RuleSteps />
      <p className={styles.connectedNote}>
        One statement is linked to another lantern in the same round. Use the linked statement to
        work out its truth.
      </p>
      <button type="button" onClick={onChoose}>
        Choose a difficulty
      </button>
    </section>
  );
}
