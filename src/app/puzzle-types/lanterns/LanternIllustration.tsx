import styles from "./LanternIllustration.module.css";

/** Draw the paper, frame, and warm inner light. */
function LanternDrawing({ paperId, lightId }: { paperId: string; lightId: string }) {
  return (
    <>
      <defs>
        <linearGradient id={paperId} x1="0" x2="1">
          <stop offset="0" stopColor="#9d624b" />
          <stop offset="0.18" stopColor="#d99a5a" />
          <stop offset="0.48" stopColor="#ffedb9" />
          <stop offset="0.78" stopColor="#d58f50" />
          <stop offset="1" stopColor="#754a48" />
        </linearGradient>
        <radialGradient id={lightId}>
          <stop stopColor="#fff9d5" stopOpacity=".96" />
          <stop offset=".42" stopColor="#ffe08a" stopOpacity=".7" />
          <stop offset="1" stopColor="#ffbd58" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M40 13V8q10-5 20 0v5M34 17h32" fill="none" stroke="#d2a36c" strokeWidth="2" />
      <path
        d="M32 18Q50 10 68 18L78 34Q83 70 68 108Q50 118 32 108Q17 70 22 34Z"
        fill={`url(#${paperId})`}
        stroke="#ffe6ae"
        strokeOpacity=".78"
        strokeWidth="1.6"
      />
      <path
        d="M31 22Q25 67 35 104M69 22Q75 67 65 104M23 39h54M20 54h60M20 70h60M24 87h52M30 102h40"
        fill="none"
        stroke="#70484a"
        strokeOpacity=".43"
        strokeWidth="1.5"
      />
      <ellipse cx="50" cy="66" rx="27" ry="40" fill={`url(#${lightId})`} />
      <path
        d="M32 109h36l-4 7H36Zm10 8h16l-4 9h-8Z"
        fill="#493b48"
        stroke="#d5a56e"
        strokeWidth="1.4"
      />
      <path d="M38 17q12-5 24 0M35 108q15 9 30 0" fill="none" stroke="#fff0bf" strokeWidth="1.6" />
    </>
  );
}

/** Draw one reusable lantern for the board and the game guide. */
export function LanternIllustration({
  id,
  className,
  dimmed = false,
}: {
  id: string;
  className?: string;
  dimmed?: boolean;
}) {
  return (
    <svg
      className={`${styles.illustration} ${dimmed ? styles.dimmed : ""} ${className ?? ""}`}
      viewBox="0 0 100 140"
      aria-hidden="true"
    >
      <LanternDrawing paperId={`paper-${id}`} lightId={`light-${id}`} />
    </svg>
  );
}
