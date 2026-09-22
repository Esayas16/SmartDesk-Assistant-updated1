# SmartDesk Assistant

`frontend/` (React + Vite app) and `backend/` (Express API + PostgreSQL),
plus a real AI integration.

## Structure

```
frontend/   React 19 + Vite + Tailwind v4 app (offline-first UI, unchanged in behavior)
backend/    Express API + PostgreSQL: /api/health, /api/categories, /api/issues,
            /api/history, /api/settings, /api/ai/ask
docker-compose.yml   Runs Postgres + the backend together
```

The frontend keeps its offline-first design: it still reads from its bundled
knowledge base and localStorage first, and now **also** syncs history and
settings to the backend, and calls a real AI endpoint, whenever it's online
and the backend is reachable. If the backend is down or unset, the app keeps
working exactly as it did before (local knowledge base, mock AI replies).

## Turn on the real AI (Claude)

The AI Assistant page gives **live Claude replies** once the backend has an
API key. Without a key it still works, but only with demo answers.

1. Get an API key from <https://console.anthropic.com/>.
2. **Docker:** copy `.env.example` to `.env` in the project root, paste the key
   after `ANTHROPIC_API_KEY=`, then run `docker compose up --build`.
   **Without Docker:** put the key in `backend/.env` and run `npm run dev`.
3. Open the AI Assistant page. The note under the chat tells you the status
   (live / demo / backend unreachable), and answers are labelled **Claude AI**.

How it behaves: when online, every question goes to Claude (with the last few
messages for context, and a matching knowledge-base article as grounding). If the
backend or AI is unavailable, SmartDesk falls back to its offline knowledge base,
so it never leaves the user without an answer. The key stays on the server and is
never sent to the browser. Optionally set `ANTHROPIC_MODEL` to change the model.

**Hosting on GitHub Pages?** The website can't call Claude directly (that would
expose your key). Deploy the `backend/` somewhere public (Render, Railway, Fly.io...),
set its `CORS_ORIGIN` to your Pages URL, and add a repository *variable* named
`VITE_API_URL` with the backend's URL before the next deploy.

## Site icon

`frontend/public/favicon.svg` (plus `favicon.ico`, `favicon-32.png`,
`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) shows a support-desk
monitor with a diagnostic pulse line and an AI sparkle, in the app's dark/cyan
colours. The same logo is used in the sidebar.

## Quick start (Docker)

The fastest way to get Postgres + the backend running:

```bash
docker compose up --build
```

This starts Postgres on `localhost:5432`, then the backend on
`localhost:4000`, applying the schema and seeding the knowledge base (10
categories, 49 issues) automatically on every start.

Then, in a separate terminal, run the frontend:

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:4000 (default)
npm run dev
```

Open the app, and the Dashboard's "AI assistant available" / "49 issues"
stats, History page, and AI Assistant chat are now all backed by Postgres.

## Running everything without Docker

### 1. PostgreSQL

Create a database and user (adjust to taste):

```sql
CREATE USER smartdesk WITH PASSWORD 'smartdesk';
CREATE DATABASE smartdesk OWNER smartdesk;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set DATABASE_URL to your Postgres connection string, and
# optionally ANTHROPIC_API_KEY for real AI replies instead of the mock.
npm run db:setup   # creates tables (migrate) and seeds the knowledge base (seed)
npm run dev
```

The backend listens on `http://localhost:4000` and exposes:

- `GET  /api/health` — health check (also reports Postgres connectivity)
- `GET  /api/categories` — the 10 troubleshooting categories
- `GET  /api/issues` — the 49 seeded issues; supports `?q=`, `?category=`,
  `?difficulty=`, `?offlineOnly=true`
- `GET  /api/issues/:id` — a single issue
- `GET/POST/DELETE /api/history` — per-device diagnostic history, scoped by
  an `X-Device-Id` header the frontend generates and stores in localStorage
- `GET/PUT /api/settings` — per-device settings, same `X-Device-Id` scoping
- `POST /api/ai/ask` — `{ message, context }` → hybrid AI reply. It first
  checks the Postgres knowledge base for a matching issue (for grounding and
  `relatedIssueId`), then either calls Claude (if `ANTHROPIC_API_KEY` is set)
  or returns a knowledge-base-grounded mock reply. Every exchange is logged
  to the `ai_conversations` table.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:4000
npm run dev
```

## What changed from the frontend-only prototype

The original project's "AI" and history logic ran entirely in the browser
against localStorage, with a mocked cloud-AI call and an in-memory
placeholder history endpoint. This restructure adds:

- **PostgreSQL** as the real, persistent store for the knowledge base
  (`categories`, `issues`), diagnostic **history**, per-device **settings**,
  and a log of AI **conversations** — see `backend/src/db/schema.sql`.
- **A real backend** (`backend/`) with routes for all of the above, migration
  (`npm run migrate`) and seed (`npm run seed`) scripts, and a `docker-compose.yml`
  that runs Postgres + the backend together with one command.
- **AI integration**: `POST /api/ai/ask` calls Claude
  (`claude-sonnet-4-6`) via the Anthropic Messages API when
  `ANTHROPIC_API_KEY` is set, grounding its answer in a matching issue from
  the Postgres knowledge base when one is found. No API key is ever sent to
  the browser. Without a key, it still returns a knowledge-base-grounded mock
  reply so the app works out of the box.
- **Frontend wiring**: a new `frontend/src/services/apiClient.js` calls the
  backend with a per-device id; `hybridAIService.js`'s `askCloudAI()` now
  tries the real backend first and falls back to its original local mock;
  `historyService.js` and `settingsService.js` push changes to the backend
  and pull on page load, while continuing to treat localStorage as the
  offline source of truth. All of this is best-effort and silently falls
  back to local-only behavior if the backend is unreachable, so the
  offline-first design described in the internship report is preserved.

## What was fixed (carried over from the previous restructure)

**Light mode toggle** — Settings had a working button that only saved a
preference and displayed "not available yet." There was no light color
palette and nothing applied the theme to the page. Fixed by:

- Adding a light palette as CSS variable overrides in
  `frontend/src/index.css` under `html[data-theme="light"]`.
- Having `AppContext` mirror `settings.theme` onto
  `document.documentElement`'s `data-theme` attribute whenever it changes.
- Reading the saved theme in `index.html` before React mounts, to avoid a
  flash of the wrong theme on load.
- Removing the "not yet available" placeholder text in Settings, since the
  toggle now actually switches themes.
