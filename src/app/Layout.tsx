import { Suspense, useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import { text } from "../text/en";
import { ErrorBoundary } from "./ErrorBoundary";
import styles from "./Layout.module.css";

type ThemeMode = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      if (typeof window.matchMedia === "function") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    } catch {
      // In test or restricted environments
    }
    return "light";
  });

  useEffect(() => {
    try {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    } catch {
      // In test or restricted environments
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}

/**
 * Main application layout.
 * Displays site navigation, theme switcher, page content with error/loading protection, and footer.
 */
export function Layout() {
  const { theme, toggleTheme } = useTheme();

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
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? text.theme.switchToLight : text.theme.switchToDark}
            title={theme === "dark" ? text.theme.switchToLight : text.theme.switchToDark}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>
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
