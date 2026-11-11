# Task Manager App

A mobile to-do list app built to the Figma design for the SDE-1 (MERN Stack) assignment. Create, edit, delete and search tasks, organise them by week (Monday–Sunday), and track open vs completed counts per week.

## Stack

- **Frontend** — Next.js (Pages Router) + React + Tailwind CSS, JavaScript only
- **State** — Redux Toolkit, async thunks over the Task API
- **Backend** — Node.js + Express 5 + MongoDB (Mongoose) + Joi validation
- **Deploy** — Vercel, one project per folder (see below)

## Project structure

```text
Task-Manager-App
├── frontend/               Next.js app
│   ├── pages/
│   │   ├── _app.js         Redux Provider
│   │   ├── _document.js    Inter font, meta
│   │   ├── index.js        Onboarding + Home
│   │   ├── search.js       Search screen
│   │   └── weeks.js        Week cards, tap to expand
│   ├── src/
│   │   ├── Api/            apiInstance (axios), TaskApi, CommonApi
│   │   ├── Component/      SearchBar, WeekStrip, SummaryCard, WeeklyProgress,
│   │   │                   TaskRow, TaskSheet, WeekCard, Onboarding,
│   │   │                   EmptyState, PriorityBadge
│   │   ├── Layout/         MobileShell (390px app shell), AppLayout
│   │   ├── Redux/          store, tasksSlice
│   │   ├── hooks/          useTasks, useWeek
│   │   ├── lib/            week.js (Monday-start weeks, grouping)
│   │   ├── utils/          format.js (dates, times)
│   │   ├── labels/         labels.js (every UI string in one place)
│   │   ├── data/           seedTasks.js (the 4 Figma tasks)
│   │   └── theme.jsx       Colours: primary #4566EC, complete #EFF2FF, pending #FFE6E7
│   ├── styles/globals.css
│   └── package.json
└── backend/                Express + MongoDB API (mirrors K-and-A-Jewellery-Bills/backend)
    ├── api/index.js        Vercel serverless entry - mounts the Express app
    ├── controller/task.js  getTasks, getWeekSummary, create/update/delete/toggle
    ├── middleware/validate.js
    ├── model/task.js
    ├── routes/taskRoutes.js
    ├── validation/taskValidation.js
    ├── index.js            Express app, /api/tasks, GET /health
    ├── seed.js             Inserts the 4 Figma demo tasks when the DB is empty
    ├── vercel.json         Rewrites /api/* to the serverless Express entry
    ├── .env.example
    └── package.json
```

## Design

Pixel-matched to the Figma file "To Do List Mobile app", measured at 100% zoom: frames 390 × 844, content 342 px with 24 px side margins. Colours: primary `#4566EC`, complete card `#EFF2FF`, pending card `#FFE6E7`, progress fill `#253C98` on `#DADAFF` track, search border `#E6E6E6`, home background `#FDFDFF`, dark text `#090E23`. Type uses the system sans-serif stack (the Figma font family is not verifiable from a guest view). Screens: Onboarding (552 px hero), Home, Add New Task sheet (390 × 585), Search, Weeks.

Two deliberate deviations from the Figma, both required by the brief:

- The Figma Add Task sheet has no Priority field, so one was added in the same visual style (Low / Medium / High, default Medium).
- The iOS keyboard drawn in the Figma search frame is the phone keyboard, not UI — the web app brings up the device keyboard when the search field is focused.

## API

Base: `<backend-url>/api/tasks`

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

Install each side once:

```bash
cd frontend && npm install
cd ../backend && npm install
```

Put your MongoDB Atlas connection string in `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

```text
MONGO_DB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=5000
```

Seed the demo tasks (only inserts when the collection is empty):

```bash
cd backend && npm run seed
```

Run the API and the frontend in two terminals:

```bash
cd backend && npm run dev    # Express on http://localhost:5000
cd frontend && npm run dev   # Next.js on http://localhost:3000
```

In development, Next.js proxies same-origin `/api/*` calls to the Express server on port 5000, so no extra configuration is needed. The app also works with no database at all: the Redux slice starts from the four Figma seed tasks and applies creates/updates/deletes locally when the API is unreachable.

## Deploy on Vercel

Deploy the two folders as two Vercel projects:

**Backend**

1. Import this repo in Vercel with the Root Directory set to `backend`.
2. Set the environment variable `MONGO_DB_URI` to your Atlas connection string.
3. Deploy. `/api/*` is rewritten to the Express app in `backend/api/index.js`. Note the live backend URL.

**Frontend**

1. Import this repo in Vercel with the Root Directory set to `frontend`.
2. Set the environment variable `NEXT_PUBLIC_API_URL` to the live backend URL from above (for example `https://task-manager-app-backend.vercel.app`).
3. Deploy.

The frontend calls the backend through `NEXT_PUBLIC_API_URL`, so the two deploys stay independent. Leave `NEXT_PUBLIC_API_URL` unset only when the frontend and the API share one origin.

No secret is committed anywhere in this repo — credentials only ever live in environment variables.
