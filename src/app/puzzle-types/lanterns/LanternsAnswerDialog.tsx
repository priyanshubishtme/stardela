import { useCallback } from "react";
import type { KeyboardEvent, RefCallback } from "react";
import type { LanternState } from "./puzzle";
import styles from "./LanternsSession.module.css";

/** Keep keyboard focus inside the statement dialog. */
function handleDialogKey(
  event: KeyboardEvent<HTMLDialogElement>,
  onAnswer: (state: LanternState) => void,
  onClose: () => void,
) {
  if (event.key === "Escape") onClose();
  if (event.key.toLowerCase() === "l") onAnswer("lit");
  if (event.key.toLowerCase() === "d") onAnswer("dark");
  if (event.key !== "Tab") return;
  const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
  const first = buttons[0];
  const last = buttons.item(buttons.length - 1);
  if (
    event.shiftKey &&
    (document.activeElement === first || !event.currentTarget.contains(document.activeElement))
  ) {
    event.preventDefault();
    last?.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last || !event.currentTarget.contains(document.activeElement))
  ) {
    event.preventDefault();
    first?.focus();
  }
}

/** Show the two distinct truth-state choices. */
function AnswerChoices({ onAnswer }: { onAnswer: (state: LanternState) => void }) {
  return (
    <div className={styles.actions} aria-label="Choose the statement classification">
      <button
        type="button"
        className={styles.litChoice}
        aria-label="Lit - true"
        onClick={() => onAnswer("lit")}
      >
        <span aria-hidden="true">✦</span>
        <strong>Lit</strong>
        <small>True</small>
      </button>
      <button
        type="button"
        className={styles.darkChoice}
        aria-label="Dark - false"
        onClick={() => onAnswer("dark")}
      >
        <span aria-hidden="true">◐</span>
        <strong>Dark</strong>
        <small>False</small>
      </button>
    </div>
  );
}

/** Show one statement and let the player classify it in the same panel. */
export function LanternsAnswerDialog({
  statement,
  category,
  onAnswer,
  onClose,
}: {
  statement: string;
  category: string;
  onAnswer: (state: LanternState) => void;
  onClose: () => void;
}) {
  const headingRef = useCallback<RefCallback<HTMLHeadingElement>>((node) => {
    if (node) node.focus();
  }, []);
  return (
    <div className={styles.dialogBackdrop}>
      <dialog
        open
        className={styles.clue}
        aria-modal="true"
        aria-labelledby="lantern-clue-title"
        onKeyDown={(event) => handleDialogKey(event, onAnswer, onClose)}
      >
        <div className={styles.dialogTopline}>
          <p className={styles.category}>{category.replaceAll("-", " ")}</p>
          <button type="button" className={styles.closeClue} onClick={onClose}>
            Cancel
          </button>
        </div>
        <p className={styles.dialogInstruction}>
          Read the statement, then classify it as true or false.
        </p>
        <h2 id="lantern-clue-title" ref={headingRef} tabIndex={-1}>
          {statement}
        </h2>
        <AnswerChoices onAnswer={onAnswer} />
      </dialog>
    </div>
  );
}
