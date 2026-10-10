import { Link } from "react-router";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.errorCode}>404</div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.description}>
        The puzzle you're looking for seems to have gone missing. It might have been solved, moved,
        or never existed at all.
      </p>
      <Link to="/" className={styles.homeLink}>
        Return to Home
      </Link>
    </div>
  );
}
