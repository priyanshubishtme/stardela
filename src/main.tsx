import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import { ErrorBoundary } from "./app/ErrorBoundary.tsx";
import { router } from "./app/router.ts";

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error('The page has no element with the ID "root".');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
