import { useParams } from "react-router";
import { text } from "../../text/en";
import styles from "./PuzzlePage.module.css";

export function PuzzlePage() {
  const { puzzleId } = useParams<{ puzzleId: string }>();

  return (
    <div className={styles.container}>
      <title>{text.puzzlePage.title(puzzleId ?? "Puzzle")}</title>
      <p>Puzzle Page</p>
    </div>
  );
}
