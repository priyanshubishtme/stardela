import type { Lantern, LanternState } from "./puzzle";
import styles from "./Board.module.css";

/** Draw the paper ribs, warm core, and frame of one lantern. */
function LanternArt({ id }: { id: string }) {
  return (
    <svg className={styles.art} viewBox="0 0 100 126" aria-hidden="true">
      <defs>
        <linearGradient id={`paper-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#ad694b" />
          <stop offset="0.2" stopColor="#f0bb69" />
          <stop offset="0.5" stopColor="#fff0be" />
          <stop offset="0.8" stopColor="#d99251" />
          <stop offset="1" stopColor="#8c5b53" />
        </linearGradient>
        <radialGradient id={`light-${id}`}>
          <stop stopColor="#fff7d4" stopOpacity=".92" />
          <stop offset="1" stopColor="#ffbd58" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M38 12V7q12-6 24 0v5M33 15h34M31 18C24 40 25 80 36 103q14 9 28 0c11-23 12-63 5-85Z"
        fill={`url(#paper-${id})`}
        stroke="#ffe7ad"
        strokeOpacity=".75"
        strokeWidth="1.2"
      />
      <path
        d="M35 20q-7 40 2 78m28-78q7 40-2 78M28 34h44M27 48h46M28 63h44M30 79h40M34 94h32"
        fill="none"
        stroke="#774e4b"
        strokeOpacity=".42"
        strokeWidth="1.3"
      />
      <ellipse cx="50" cy="61" rx="19" ry="28" fill={`url(#light-${id})`} />
      <path
        d="M37 104h26l-3 6H40Zm7 7h12l-3 7h-6Z"
        fill="#59404a"
        stroke="#d8a66d"
        strokeWidth="1"
      />
      <path d="M40 103q10 8 20 0M39 13q11-5 22 0" fill="none" stroke="#ffe4a2" strokeWidth="1.4" />
    </svg>
  );
}

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
      className={`${styles.lantern} ${selected ? styles.selected : ""} ${answer ? styles.answered : ""} ${answer === "lit" ? styles.lit : ""} ${answer === "dark" ? styles.dark : ""}`}
      onClick={() => onInspect(lantern.id)}
      disabled={Boolean(answer) || blocked}
      aria-label={`Lantern ${index + 1}`}
    >
      <LanternArt id={lantern.id} />
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
