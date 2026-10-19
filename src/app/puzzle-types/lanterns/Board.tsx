import type { Lantern, LanternState } from "./puzzle";
import { LanternIllustration } from "./LanternIllustration";
import styles from "./Board.module.css";

/** Show one lantern and keep its locked answer hidden until the end. */
function LanternButton({
  lantern,
  index,
  answer,
  selected,
  blocked,
  onInspect,
}: {
  lantern: Lantern;
  index: number;
  answer?: LanternState;
  selected: boolean;
  blocked: boolean;
  onInspect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      data-lantern-button="true"
      data-lantern-id={lantern.id}
      className={`${styles.lantern} ${selected ? styles.selected : ""} ${answer ? styles.answered : ""} ${answer === "lit" ? styles.lit : ""} ${answer === "dark" ? styles.dark : ""}`}
      onClick={() => onInspect(lantern.id)}
      disabled={Boolean(answer) || blocked}
      aria-label={`Lantern ${index + 1}`}
    >
      <LanternIllustration id={lantern.id} className={styles.art} dimmed={answer === "dark"} />
      <span className={styles.glow} aria-hidden="true">
        {String.fromCodePoint(0x2726)}
      </span>
      <span className={styles.number}>{lantern.id.slice(-3)}</span>
      <span className={styles.category}>{lantern.category.replaceAll("-", " ")}</span>
      <span className={styles.state}>
        {answer ? `${answer === "lit" ? "Lit" : "Dark"} - locked` : "Inspect"}
      </span>
    </button>
  );
}

/** Draw the floating lanterns and keep locked answers hidden until the end. */
export function Board({
  lanterns,
  answers,
  selectedId,
  onInspect,
}: {
  lanterns: readonly Lantern[];
  answers: Readonly<Record<string, LanternState>>;
  selectedId: string | null;
  onInspect: (id: string) => void;
}) {
  return (
    <div className={styles.board} aria-label="Lantern collection">
      {lanterns.map((lantern, index) => (
        <LanternButton
          key={lantern.id}
          lantern={lantern}
          index={index}
          answer={answers[lantern.id]}
          selected={selectedId === lantern.id}
          blocked={selectedId !== null}
          onInspect={onInspect}
        />
      ))}
    </div>
  );
}
