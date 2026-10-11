import { Suspense } from "react";
import { Link, Outlet } from "react-router";
import { text } from "../text/en";
import { ErrorBoundary } from "./ErrorBoundary";
import styles from "./Layout.module.css";

/**
 * Main application layout.
 * Displays site navigation, page content with error/loading protection, and footer.
 */
export function Layout() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        {text.skipLink}
      </a>
      <header className={styles.header}>
        <Link className={styles.siteName} to="/">
          {text.siteName}
        </Link>
        <nav aria-label={text.nav.label} className={styles.nav}>
          <Link to="/">{text.nav.home}</Link>
        </nav>
      </header>
      <main id="main" className={styles.main} tabIndex={-1}>
        <ErrorBoundary>
          <Suspense fallback={<p>{text.puzzlePage.loading}</p>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer className={styles.footer}>
        <p>{text.footer.content}</p>
      </footer>
    </>
  );
}
