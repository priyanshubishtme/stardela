# Stardela — Daily Puzzle Collection

A modern, distraction-free web puzzle game featuring daily challenges, multiple difficulty tiers, and instant client-side gameplay.

---

## 🧩 Featured Puzzle Types

- **Colour Binary**: Fill the grid with red and blue tiles following strict parity and adjacency constraints. Available in **Easy (4×4)**, **Medium (6×6)**, and **Hard (8×8)**.
- **Guzzle**: Cross-word deduction puzzle where four equal-length words meet at a fixed center tile (across, down, and two diagonals). Provides feedback on letter position (Green = correct, Yellow = in line, Red = absent) and playable with or without the letter bank. Available in **Easy (3×3)**, **Medium (5×5)**, and **Hard (7×7)**.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Routing**: React Router (with SPA history fallback via `vercel.json`)
- **Linting & Formatting**: Oxlint + Oxfmt
- **Testing**: Vitest + React Testing Library

---

## 🚀 Local Development

### Prerequisites

- Node.js `24.x` (or LTS `20.x`+)
- npm `10.x`+

### Setup & Run

1. **Clone the repository**:

   ```bash
   git clone https://github.com/priyanshubishtme/stardela.git
   cd stardela
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run CI pipeline checks** (Format, Lint, Typecheck, Test, Validate, Build):

   ```bash
   npm run check
   ```

5. **Auto-fix formatting and linting**:
   ```bash
   npm run fix
   ```

---

## 🌐 Deploy to Vercel

Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git push origin master
   ```
2. Navigate to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Import your **`stardela`** GitHub repository.
5. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (or leave default `tsc -b && vite build`)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)
6. Click **"Deploy"**. Vercel will build and deploy your app with continuous deployment on every `git push`.

> [!NOTE]
> Client-side routing for `/puzzles/:id` and direct page reloads is pre-configured via [`vercel.json`](./vercel.json) rewrite rules.

---

---

## 📜 License

Content and puzzles CC-BY-4.0 by Priyanshu Bisht 
