# Task Manager App

A mobile to-do list app built to the Figma design for the SDE-1 (MERN Stack) assignment. Create, edit, delete and search tasks, organise them by week (Monday–Sunday), and track open vs completed counts per week.

## Stack

- **Frontend** — Next.js (Pages Router) + React + Tailwind CSS, JavaScript only
- **State** — Redux Toolkit, async thunks over the Task API
- **Backend** — Node.js + Express 5 + MongoDB (Mongoose) + Joi validation
- **Deploy** — Vercel (frontend + Express API as a serverless function, one repo)

## Project structure

```text
Task-Manager-App
├── api/
│   └── index.js            Vercel serverless entry - mounts the Express app
├── backend/                Express + MongoDB API (mirrors K-and-A-Jewellery-Bills/backend)
│   ├── controller/task.js  getTasks, getWeekSummary, create/update/delete/toggle
│   ├── middleware/validate.js
│   ├── model/task.js
│   ├── routes/taskRoutes.js
│   ├── validation/taskValidation.js
│   ├── index.js            Express app, /api/tasks, GET /health
│   ├── seed.js             Inserts the 4 Figma demo tasks when the DB is empty
│   └── .env.example
├── pages/
│   ├── _app.js             Redux Provider
│   ├── _document.js        Inter font, meta
│   ├── index.js            Onboarding + Home
│   ├── search.js           Search screen
│   └── weeks.js            Week cards, tap to expand
├── src/
│   ├── Api/                apiInstance (axios), TaskApi, CommonApi
│   ├── Component/          SearchBar, WeekStrip, SummaryCard, WeeklyProgress,
│   │                       TaskRow, TaskSheet, WeekCard, Onboarding,
│   │                       EmptyState, PriorityBadge
│   ├── Layout/             MobileShell (390px app shell), AppLayout
│   ├── Redux/              store, tasksSlice
│   ├── hooks/              useTasks, useWeek
│   ├── lib/                week.js (Monday-start weeks, grouping)
│   ├── utils/              format.js (dates, times)
│   ├── labels/             labels.js (every UI string in one place)
│   ├── data/               seedTasks.js (the 4 Figma tasks)
│   └── theme.jsx           Colours: primary #4566EC, complete #EFF2FF, pending #FFE6E7
├── styles/globals.css
├── vercel.json             Rewrites /api/* to the serverless Express entry
└── package.json
```

## Design

Pixel-matched to the Figma file "To Do List Mobile app", measured at 100% zoom: frames 390 × 844, content 342 px with 24 px side margins. Colours: primary `#4566EC`, complete card `#EFF2FF`, pending card `#FFE6E7`, progress fill `#253C98` on `#DADAFF` track, search border `#E6E6E6`, home background `#FDFDFF`, dark text `#090E23`. Type uses the system sans-serif stack (the Figma font family is not verifiable from a guest view). Screens: Onboarding (552 px hero), Home, Add New Task sheet (390 × 585), Search, Weeks.

Two deliberate deviations from the Figma, both required by the brief:

- The Figma Add Task sheet has no Priority field, so one was added in the same visual style (Low / Medium / High, default Medium).
- The iOS keyboard drawn in the Figma search frame is the phone keyboard, not UI — the web app brings up the device keyboard when the search field is focused.

## API

Base: `/api/tasks`

| Method | Route | Description |
| --- | --- | --- |
| GET | `/tasks?search=&weekStart=YYYY-MM-DD` | List tasks, optional keyword search and week filter |
| GET | `/tasks/summary?weekStart=YYYY-MM-DD` | `{ open, completed, total }` for a week |
| POST | `/tasks` | Create task (title + dateTime required) |
| GET | `/tasks/:id` | One task |
| PUT | `/tasks/:id` | Update any attribute |
| PATCH | `/tasks/:id/status` | Toggle `In Progress` / `Completed` |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/health` | `{ message: "Server health is green and running" }` |

Task shape: `{ title, description, dateTime, endDateTime, priority: Low|Medium|High, status: In Progress|Completed }`.

## Run locally

```bash
npm install
cp backend/.env.example backend/.env
```

Put your MongoDB Atlas connection string in `backend/.env`:

```text
MONGO_DB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=5000
```

Seed the demo tasks (only inserts when the collection is empty):

```bash
npm run seed
```

Run the API and the frontend in two terminals:

```bash
npm run dev:server   # Express on http://localhost:5000
npm run dev           # Next.js on http://localhost:3000
```

In development, Next.js proxies same-origin `/api/*` calls to the Express server. The app also works with no database at all: the Redux slice starts from the four Figma seed tasks and applies creates/updates/deletes locally when the API is unreachable.

## Deploy on Vercel

1. Import this repo in Vercel.
2. Set the environment variable `MONGO_DB_URI` to your Atlas connection string.
3. Deploy. The frontend is served by Next.js and `/api/*` is rewritten to the Express app in `api/index.js`.

No secret is committed anywhere in this repo — credentials only ever live in environment variables.
