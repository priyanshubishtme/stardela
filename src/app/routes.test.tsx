import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";

// Submit one answer before opening the next lantern in the route test.
async function answerTenLanterns(
  user: ReturnType<typeof userEvent.setup>,
  index = 0,
): Promise<void> {
  if (index === 10) return;
  await user.click(screen.getByRole("button", { name: `Lantern ${index + 1}` }));
  await user.click(screen.getByRole("button", { name: "Lit - true" }));
  await answerTenLanterns(user, index + 1);
}

async function startEasyChallenge(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.click(screen.getByRole("button", { name: "Start a round" }));
  await user.click(screen.getByRole("button", { name: "Start easy challenge" }));
}

// Confirm that a completed round saves its score and can start again.
async function verifyCompletedRound(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await answerTenLanterns(user);
  expect(screen.getByRole("dialog", { name: /challenge/u })).toBeDefined();
  await user.click(screen.getByRole("button", { name: "View explanations" }));
  expect(screen.getByText(/\d+ correct, \d+ incorrect/u)).toBeDefined();
  expect(localStorage.getItem("stardela_lanterns_stats_v1")).toContain('"played":1');
  await user.click(screen.getByRole("button", { name: "Play again" }));
  expect(screen.getByText("0 of 10 classified")).toBeDefined();
}

describe("routes - root and error", () => {
  it("has a root route that links to every available puzzle", async () => {
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

    expect(screen.getByRole("link", { name: "Play Lanterns" }).getAttribute("href")).toBe(
      "/lanterns",
    );

    const easyLinks = screen.getAllByRole("link", { name: "Easy" });
    expect(easyLinks[0]?.getAttribute("href")).toBe("/puzzles/colour-binary-0005");
    expect(easyLinks[1]?.getAttribute("href")).toMatch(/^\/puzzles\/guzzle-000[01]$/u);
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
      initialEntries: ["/puzzles/unknown-custom-id"],
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

describe("routes - Lanterns page", () => {
  it("loads the challenge and shows results only after ten answers", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/lanterns"] });
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    expect(await screen.findByRole("heading", { name: "Lanterns", level: 1 })).toBeDefined();
    await startEasyChallenge(user);
    expect(screen.getByText("0 of 10 classified")).toBeDefined();
    expect(screen.queryByText("21 is a prime number.")).toBeNull();

    await verifyCompletedRound(user);
  });

  it("hides correctness after an answer during the round", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/lanterns"] });
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    await startEasyChallenge(user);
    await user.click(screen.getByRole("button", { name: "Lantern 1" }));
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByRole("button", { name: "Lit - true" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Dark - false" })).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Lit - true" }));
    expect(screen.queryByText(/Correct\.|Incorrect\./u)).toBeNull();
    expect(screen.getByText("1 of 10 classified")).toBeDefined();
  });

  it("opens the landing screen when saved statistics are malformed", async () => {
    localStorage.setItem("stardela_lanterns_stats_v1", "invalid json");
    const router = createMemoryRouter(routes, { initialEntries: ["/lanterns"] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("button", { name: "Start a round" })).toBeDefined();
  });

  it("starts a Tough round from the difficulty menu", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/lanterns"] });
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Start a round" }));
    await user.click(screen.getByRole("button", { name: /ToughSolve layered logic/u }));
    await user.click(screen.getByRole("button", { name: "Start tough challenge" }));
    expect(screen.getByText("TOUGH - 70% to pass - 10 remaining")).toBeDefined();
  });
});
