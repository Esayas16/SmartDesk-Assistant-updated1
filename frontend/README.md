# SmartDesk Assistant

Offline-first, hybrid-AI enterprise IT troubleshooting and diagnostic platform prototype.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## What's implemented

- Dashboard, Categories, Category detail, interactive step-by-step Diagnosis workflow,
  Search (with filters), AI Assistant (hybrid routing with a mock cloud AI), Diagnostics
  (clearly-labeled demo network data), History, and Settings pages.
- `src/services/hybridAIService.js` implements the offline-rule-engine -> offline-knowledge-base
  -> mock-cloud-AI routing logic described in the project brief, ready to be pointed at a real
  backend later (see the comment in `askCloudAI`).
- `src/services/connectivityService.js` provides real `navigator.onLine` detection plus a manual
  Connection Simulation override (Settings page) for demoing offline behavior.
- 49 seeded troubleshooting issues across 10 categories in `src/data/issues.js`.
- All "diagnostic" values (ping, IP, DNS, etc.) are simulated and explicitly labeled as demo data,
  since a browser sandbox cannot perform real low-level network probing.
- No API keys are present in the frontend. `hybridAIService.askCloudAI` is a clearly-marked mock
  ready for a real backend integration.

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes this app automatically.

**One-time setup on GitHub:**

1. Push this repo to GitHub (if not already there).
2. Go to **Settings → Pages** in your repo.
3. Under "Build and deployment", set **Source** to **GitHub Actions**.
4. Push to `main`/`master` (or run the workflow manually from the **Actions** tab) — the site
   builds and deploys automatically. The deployed URL appears on the workflow run summary and
   under Settings → Pages, typically `https://<your-username>.github.io/<repo-name>/`.

**Why the base path matters:** GitHub Pages serves a project repo under a subpath
(`/repo-name/`), not the domain root, so the build passes `--base=/<repo-name>/` to Vite
automatically (it reads the repo name at build time — no manual config needed). `main.jsx`'s
router picks this up via `import.meta.env.BASE_URL`, and `public/404.html` + a small script in
`index.html` redirect deep links (e.g. refreshing on `/dashboard`) back through `index.html` so
React Router can handle them — GitHub Pages has no server-side routing of its own, so without
this, refreshing anywhere but the homepage would 404.

If you ever rename the repo, no changes are needed — the workflow re-reads the current repo name
on every run.

## Project structure

```
src/
  components/   Reusable UI components (Sidebar, StatCard, IssueCard, AIChat, diagrams, ...)
  pages/        Route-level pages
  layouts/      MainLayout (sidebar + header + mobile nav)
  data/         Categories and issues knowledge base
  services/     connectivity, storage, hybridAI, diagnostics, history, settings, knowledge base
  hooks/        AppContext (global state) and useToast
  utils/        Icon resolver
```
