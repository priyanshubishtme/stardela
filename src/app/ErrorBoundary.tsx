import { Component, type ErrorInfo, type ReactNode } from "react";
import { getLogger } from "../shared/logger";
import { text } from "../text/en";
import styles from "./RouteError.module.css";

/**
 * Props for ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Internal state tracking whether a render error occurred.
 */
interface State {
  hasError: boolean;
}

/**
 * Catch errors in child components to prevent whole website crashes.
 * Displays a recovery message with a link to the home page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  override state: State = { hasError: false };

  /**
   * Update state so next render displays the fallback UI.
   */
  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  /**
   * Log caught error information for observability.
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const log = getLogger("app.error-boundary");
    log.error("ErrorBoundary caught an error", {
      errorMessage: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  /**
   * Render either child elements or error recovery interface.
   */
  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className={styles.main} role="alert">
          <h2>{text.routeError.title}</h2>
          <p>{text.routeError.body}</p>
          <a href="/">{text.routeError.homeLink}</a>
        </div>
      );
    }
    return this.props.children;
  }
}
