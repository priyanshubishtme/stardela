import { type RouteObject } from "react-router";
import { Layout } from "./Layout";
import { RouteError } from "./RouteError";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "1",
        element: <div>Hello from 1!</div>,
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
