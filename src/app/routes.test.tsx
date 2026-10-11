import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";

describe("routes - root and error", () => {
  it("has a root route that displays puzzle types and coming soon badges", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    const puzzle1 = await screen.findByRole("heading", { name: "Guzzle", level: 3 });
    const puzzle2 = screen.getByRole("heading", { name: "Lanterns", level: 3 });
    const colorBinary = screen.getByRole("heading", { name: "Colour Binary", level: 3 });

    expect(puzzle1).toBeDefined();
    expect(puzzle2).toBeDefined();
    expect(colorBinary).toBeDefined();

    const badges = screen.getAllByText("Coming Soon");
    expect(badges).toHaveLength(1);

    expect(screen.getByRole("link", { name: "Easy" }).getAttribute("href")).toBe(
      "/puzzles/colour-binary-0005",
    );
    expect(screen.getByRole("link", { name: "Play Daily" })).toBeDefined();
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

describe("routes - puzzle pages", () => {
  it("renders the puzzle page for /puzzles/:puzzleId fallback", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/puzzles/guzzle"],
    });

    render(<RouterProvider router={router} />);

    const puzzlePageText = await screen.findByText("Puzzle Page");
    expect(puzzlePageText).toBeDefined();
  });

  it("renders the Colour Binary puzzle page for /color-binary", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/color-binary"],
    });

    render(<RouterProvider router={router} />);

    const heading = await screen.findByRole("heading", { name: "Colour Binary", level: 1 });
    expect(heading).toBeDefined();
    expect(screen.getByText("RULES")).toBeDefined();
    expect(screen.getByRole("button", { name: "Hint" })).toBeDefined();
  });

  it("renders the Colour Binary puzzle page for /puzzles/colour-binary-0005", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/puzzles/colour-binary-0005"],
    });

    render(<RouterProvider router={router} />);

    const heading = await screen.findByRole("heading", { name: "Colour Binary", level: 1 });
    expect(heading).toBeDefined();
    expect(screen.getByText("Puzzle colour-binary-0005")).toBeDefined();
    expect(screen.getByText("Level: easy")).toBeDefined();
  });
});

describe("routes - guzzle page", () => {
  it("renders the Guzzle puzzle page for /guzzle", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/guzzle"],
    });

    render(<RouterProvider router={router} />);

    const heading = await screen.findByRole("heading", { name: "Guzzle", level: 1 });
    expect(heading).toBeDefined();
    expect(screen.getByText("RULES")).toBeDefined();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDefined();
  });
});
