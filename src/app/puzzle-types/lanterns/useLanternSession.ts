import { useEffect, useMemo, useState } from "react";
import type { LanternPuzzle, LanternState } from "./puzzle";
import { scoreLanterns } from "./rules-check";

/** Build the final score after the last answer. */
function buildResult(puzzle: LanternPuzzle, answers: Readonly<Record<string, LanternState>>) {
  const { correct } = scoreLanterns(puzzle.lanterns, answers);
  return {
    correct,
    total: puzzle.selectionCount,
    percentage: Math.round((correct / puzzle.selectionCount) * 100),
    passed: correct >= Math.ceil((puzzle.selectionCount * puzzle.passingPercentage) / 100),
  };
}

/** Return focus to the next lantern after an answer. */
function focusNextLantern(id: string | null) {
  const previous = document.querySelector<HTMLButtonElement>(`[data-lantern-id="${id}"]`);
  const next = previous?.disabled
    ? document.querySelector<HTMLButtonElement>('[data-lantern-button="true"]:not(:disabled)')
    : previous;
  next?.focus();
}

/** Keep locked lanterns in place and rotate the remaining open lanterns. */
function rotateOpenLanterns(ids: readonly string[], locked: ReadonlySet<string>) {
  const openIndexes = ids.flatMap((id, index) => (locked.has(id) ? [] : [index]));
  if (openIndexes.length < 2) return [...ids];
  const next = [...ids];
  for (let index = 0; index < openIndexes.length; index += 1) {
    const destination = openIndexes[index]!;
    const source = openIndexes[(index + 1) % openIndexes.length]!;
    next[destination] = ids[source]!;
  }
  return next;
}

/** Restore focus after the player locks an answer. */
function useAnswerFocus(
  selectedId: string | null,
  pending: boolean,
  lastId: string | null,
  clear: () => void,
) {
  useEffect(() => {
    if (pending && !selectedId) {
      focusNextLantern(lastId);
      clear();
    }
  }, [clear, lastId, pending, selectedId]);
}

/** Find the open lantern and build the final score when the round ends. */
function useSessionResult(
  puzzle: LanternPuzzle,
  answers: Readonly<Record<string, LanternState>>,
  selectedId: string | null,
) {
  const selected = puzzle.lanterns.find((lantern) => lantern.id === selectedId);
  const complete = Object.keys(answers).length === puzzle.selectionCount;
  const result = useMemo(
    () => (complete ? buildResult(puzzle, answers) : null),
    [answers, complete, puzzle],
  );
  return { selected, complete, result };
}

/** Track revealed clues and locked answers for one challenge. */
export function useLanternSession(puzzle: LanternPuzzle) {
  const [answers, setAnswers] = useState<Record<string, LanternState>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusAfterAnswer, setFocusAfterAnswer] = useState(false);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [lanternOrder, setLanternOrder] = useState(() =>
    puzzle.lanterns.map((lantern) => lantern.id),
  );
  const { selected, complete, result } = useSessionResult(puzzle, answers, selectedId);
  const displayedLanterns = lanternOrder.flatMap((id) => {
    const lantern = puzzle.lanterns.find((item) => item.id === id);
    return lantern ? [lantern] : [];
  });

  useAnswerFocus(selectedId, focusAfterAnswer, lastSelectedId, () => setFocusAfterAnswer(false));

  function inspect(id: string) {
    if (!complete && !selectedId && !answers[id]) {
      setLastSelectedId(id);
      setSelectedId(id);
    }
  }

  function closeStatement() {
    setSelectedId(null);
  }

  function answer(state: LanternState) {
    if (!selected || answers[selected.id]) return;
    setFocusAfterAnswer(true);
    setAnswers((current) => ({ ...current, [selected.id]: state }));
    setLanternOrder((current) =>
      rotateOpenLanterns(current, new Set([...Object.keys(answers), selected.id])),
    );
    setSelectedId(null);
  }

  return {
    answers,
    displayedLanterns,
    selected,
    complete,
    result,
    inspect,
    closeStatement,
    answer,
  };
}
