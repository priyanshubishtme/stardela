import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { RouteError } from "./RouteError";
import { text } from "../text/en";

function BrokenPage() {
  throw new Error("Test error message");
  return <></>;
}

describe("RouteError", () => {
  it("shows the error page and logs the error to the console", async () => {
    // Spy on console.error to avoid spamming the console and to assert it was called
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const router = createMemoryRouter([
      {
        path: "/",
        element: <BrokenPage />,
        errorElement: <RouteError />,
      },
    ]);

    render(<RouterProvider router={router} />);

    // Verify the error page renders correctly using our text object
    // findByRole and getByText throw if the element is not found, so we don't need .toBeInTheDocument()
    await screen.findByRole("heading", { name: text.routeError.title });
    screen.getByText(text.routeError.body);
    screen.getByRole("link", { name: text.routeError.homeLink });

    // Verify that the error was logged by React Router
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "React Router caught the following error during render",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
