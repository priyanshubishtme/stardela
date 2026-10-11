import { Component, type ErrorInfo, type ReactNode } from "react";
import { getLogger } from "../shared/logger";
import { text } from "../text/en";
import styles from "./RouteError.module.css";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const log = getLogger("app.error-boundary");
    log.error("ErrorBoundary caught an error", {
      errorMessage: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

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
