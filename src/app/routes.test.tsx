import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";

describe("routes", () => {
  it("has a root route that displays 2 puzzle types", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    // Try to find the puzzle elements by their headings
    const puzzle1 = await screen.findByRole("heading", { name: "Guzzle", level: 3 });
    const puzzle2 = screen.getByRole("heading", { name: "Lanterns", level: 3 });

    expect(puzzle1).toBeDefined();
    expect(puzzle2).toBeDefined();

    // Verify there are exactly 2 "Coming Soon" badges which correspond to the 2 puzzle types
    const badges = screen.getAllByText("Coming Soon");
    expect(badges).toHaveLength(2);
  });

  it("shows the not found page for an unknown route", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/this-route-does-not-exist"],
    });

    render(<RouterProvider router={router} />);

    const notFoundHeading = await screen.findByRole("heading", {
      name: "Page Not Found",
      level: 1,
    });
    expect(notFoundHeading).toBeDefined();
  });
});
