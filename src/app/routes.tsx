import { type RouteObject } from "react-router";
import { text } from "../text/en";
import { Layout } from "./Layout";
import { puzzleLoader } from "./Puzzle";
import { RouteError } from "./RouteError";
import { homeLoader } from "./daily";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PuzzlePage } from "./pages/PuzzlePage";

/**
 * Route definitions for the application.
 * Connects paths to pages, data loaders, and error fallbacks.
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "color-binary",
        element: <PuzzlePage />,
        loader: puzzleLoader,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "colour-binary",
        element: <PuzzlePage />,
        loader: puzzleLoader,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "guzzle",
        element: <PuzzlePage />,
        loader: puzzleLoader,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "puzzles/:puzzleId",
        element: <PuzzlePage />,
        loader: puzzleLoader,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];
