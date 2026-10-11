import { type RouteObject } from "react-router";
import { text } from "../text/en";
import { Layout } from "./Layout";
import { RouteError } from "./RouteError";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PuzzlePage } from "./pages/PuzzlePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <HomePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "color-binary",
        element: <PuzzlePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "colour-binary",
        element: <PuzzlePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
      {
        path: "puzzles/:puzzleId",
        element: <PuzzlePage />,
        hydrateFallbackElement: <p>{text.puzzlePage.loading}</p>,
      },
    ],
  },
  {
    path: "/2",
    element: <div>Hello from 2!</div>,
    errorElement: <div>page 2 found</div>,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
