import { useEffect, useMemo, useRef, useState } from "react";
import type { LanternPuzzle, LanternState } from "./puzzle";
import { scoreLanterns } from "./rules-check";

/** Track revealed clues and locked answers for one challenge. */
export function useLanternSession(puzzle: LanternPuzzle) {
  const [answers, setAnswers] = useState<Record<string, LanternState>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasAnsweredRef = useRef(false);
  const selected = puzzle.lanterns.find((lantern) => lantern.id === selectedId);
  const complete = Object.keys(answers).length === puzzle.selectionCount;
  const result = useMemo(() => {
    if (!complete) return null;
    const { correct } = scoreLanterns(puzzle.lanterns, answers);
    return {
      correct,
      total: puzzle.selectionCount,
      percentage: Math.round((correct / puzzle.selectionCount) * 100),
      passed: correct >= Math.ceil((puzzle.selectionCount * puzzle.passingPercentage) / 100),
    };
  }, [answers, complete, puzzle]);

  useEffect(() => {
    if (hasAnsweredRef.current && !selectedId) {
      document
        .querySelector<HTMLButtonElement>('[data-lantern-button="true"]:not(:disabled)')
        ?.focus();
    }
  }, [selectedId]);

  function inspect(id: string) {
    if (!complete && !selectedId && !answers[id]) setSelectedId(id);
  }

  function answer(state: LanternState) {
    if (!selected || answers[selected.id]) return;
    hasAnsweredRef.current = true;
    setAnswers((current) => ({ ...current, [selected.id]: state }));
    setSelectedId(null);
  }

  return { answers, selected, complete, result, inspect, answer };
}
