const siteName = "Skardela";

export const text = {
  siteName,
  skipLink: "Skip to main content",
  nav: {
    label: "Main",
    home: "Home",
  },
  puzzlePage: {
    title: (title: string = "Puzzle") => `${title} | ${siteName}`,
    loading: "Loading...",
  },
  footer: {
    content: "© 2026 Skardela. All rights reserved.",
  },
  routeError: {
    title: "Something went wrong",
    body: "An error stopped this page. Reload the page to try again.",
    homeLink: "Go to the home page",
  },
};
