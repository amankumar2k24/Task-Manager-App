# Task Manager App

A mobile to-do list app built to the Figma design for the SDE-1 (MERN Stack) assignment. Create, edit, delete and search tasks, organise them by week (Monday–Sunday), and track open vs completed counts per week.

## Stack

- **Frontend** — Next.js (Pages Router) + React + Tailwind CSS, TypeScript (strict mode)
- **State** — Redux Toolkit, typed async thunks over the Task API
- **Backend** — Node.js + Express 5 + MongoDB (Mongoose) + Joi validation, TypeScript (strict mode)
- **Deploy** — Vercel, one project per folder (see below)

## Project structure

```text
Task-Manager-App
├── frontend/               Next.js app (TypeScript, strict)
│   ├── pages/
│   │   ├── _app.tsx        Redux Provider
│   │   ├── _document.tsx   Poppins font (300–700), meta
│   │   ├── index.tsx       Onboarding + Home
│   │   ├── search.tsx      Search screen
│   │   └── weeks.tsx       Week cards, tap to expand
│   ├── src/
│   │   ├── Api/            apiInstance (axios), TaskApi, CommonApi
│   │   ├── Component/      SearchBar, WeekStrip, SummaryCard, WeeklyProgress,
│   │   │                   TaskRow, TaskSheet (create/edit), TaskDetailSheet (view),
│   │   │                   WeekCard, Onboarding, EmptyState, PriorityBadge, ErrorBanner
│   │   ├── Layout/         MobileShell (full screen on phones, 390x844 frame on desktop), AppLayout
│   │   ├── Redux/          store (RootState, AppDispatch), tasksSlice
│   │   ├── hooks/          useTasks, useWeek, useTaskSheets (shared view/create/edit/delete flow)
│   │   ├── lib/            week.ts (Monday-start weeks, grouping, timezone-safe week param)
│   │   ├── types/          task.ts (Task, TaskInput, TaskUpdate, Priority,
│   │   │                   TaskStatus, WeekSummary, WeekGroup, ApiResponse)
│   │   ├── utils/          format.ts (dates, times)
│   │   ├── labels/         labels.ts (every UI string in one place)
│   │   └── theme.ts        Colours: primary #4566EC, complete #EFF2FF, pending #FFE6E7
│   ├── styles/globals.css
│   ├── tsconfig.json
│   └── package.json
└── backend/                Express + MongoDB API (mirrors K-and-A-Jewellery-Bills/backend)
    ├── api/index.ts        Vercel serverless entry - mounts the Express app
    ├── controller/task.ts  Thin HTTP layer - calls the service, sends responses
    ├── service/taskService.ts  Business logic + database access (CRUD, summary, search)
    ├── middleware/validate.ts
    ├── model/task.ts       TaskAttrs interface, Mongoose model
    ├── routes/taskRoutes.ts
    ├── types/task.ts       TaskInput, TaskUpdateInput, StatusInput, TaskListQuery, WeekSummaryResponse
    ├── utils/
    │   ├── responseMessage.ts  Every API message string in one place
    │   ├── appError.ts        AppError (status code + message) thrown by services
    │   └── apiResponse.ts     Maps a thrown error to its HTTP response
    ├── validation/taskValidation.ts
    ├── index.ts            Express app, /api/tasks, GET /health
    ├── seed.ts             Inserts the 4 Figma demo tasks when the DB is empty
    ├── tsconfig.json
    ├── vercel.json         Rewrites /api/* to the serverless Express entry
    ├── .env.example
    └── package.json
```

## Design

Built from the Figma file "To Do List Mobile app" using the values read from the frames (Home, New Task, Onboarding, Search): frames 390 × 844, 24 px side margins, Poppins throughout.

- **Type:** section titles SemiBold 18px, task titles Medium 14px, summary label Regular 12px / 28px, summary count SemiBold 22px, "This Week" Regular 10px, week strip 10px / 14px with 22px line height, search placeholder Light 12px, form labels Medium 12px, form fields Regular 14px / 20px, buttons Medium 16px.
- **Colours:** primary `#4566EC`, complete card `#EFF2FF` (tile `#99ADFF`), pending card `#FFE6E7` (tile `#FFB1B5`), progress `#253C98` on `#DADAFF`, muted day text `#C0C0C0`, secondary text `#6E7180` / `#717171`, borders `#E6E6E6` / `#EAEAEA`, background `#FDFDFF`, text `#090E23`.
- **Responsive:** on phones the app fills the whole screen; from 640 px up it renders as a centred 390 × 844 phone frame.

Where the app differs from the Figma, and why:

- **Home screen and week cards.** The Figma home screen shows the selected day's tasks, so that is the home layout. The brief's weekly cards are covered two ways: the home screen's Task Complete / Task Pending cards are this week's card (open vs completed counts) and tapping them, or "View All", opens the week list, where every week is a card with its counts and the current week is expanded to show all of its tasks. Tapping any week card expands or collapses it.
- **Priority field.** The Figma Add Task sheet has no Priority field; the brief requires one, so it was added in the same style (Low / Medium / High, default Medium).
- **Task details view.** The brief asks to "view, edit, or delete" tasks. Tapping a task opens a read-only details sheet (date, time, priority, status, description) with Edit, Delete and Mark completed / in progress actions. The trash and edit icons on each row, and swipe-left-to-delete on touch screens, still work directly.
- **Rows show only the title**, as in the Figma; time and priority are in the details sheet.
- **Icons** are Lucide/Feather equivalents of the Figma icons (the Figma layers are Feather's `edit`, `trash-2`, `search`, `plus`, `arrow-left`).
- **Week strip** shows the real Monday–Sunday week (the Figma mockup shows eight days).
- The iOS keyboard drawn in the Figma search frame is the phone keyboard, not UI — the device keyboard opens when the search field is focused.

## Behaviour notes

- **Live counts.** The summary cards and Weekly Progress bar are computed from the week's task list, so they update the moment a task is toggled, added, edited or deleted.
- **New tasks go into the selected week.** The + button pre-fills the date with the day selected in the week strip.
- **Timezone-safe weeks.** Weeks run Monday 00:00 to Sunday 23:59 in the user's local time. The frontend sends the exact instant of local Monday 00:00 (e.g. `2026-11-08T18:30:00.000Z` in IST) so the API filters with the same boundaries.
- **Errors are never hidden.** Every change is applied only after the API confirms it. If a request fails, a red banner explains what went wrong, and the create/edit sheet stays open with your input so you can retry.

## API

Base: `<backend-url>/api/tasks`

| Method | Route | Description |
| --- | --- | --- |
| GET | `/tasks?search=&weekStart=` | List tasks, optional keyword search (title or description) and week filter |
| GET | `/tasks/summary?weekStart=` | `{ open, completed, total }` for a week |
| POST | `/tasks` | Create task (title + dateTime required) |
| GET | `/tasks/:id` | One task |
| PUT | `/tasks/:id` | Update any attribute |
| PATCH | `/tasks/:id/status` | Toggle `In Progress` / `Completed` |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/health` | `{ message: "Server health is green and running" }` |

Task shape: `{ title, description, dateTime, endDateTime, priority: Low|Medium|High, status: In Progress|Completed }`.

`weekStart` is the start of the week: either an ISO timestamp for the client's local Monday 00:00 (what the frontend sends, timezone-safe) or a plain `YYYY-MM-DD`, read as Monday 00:00 UTC. The range covers the following 7 days. An invalid value returns `400`.

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
cd backend && npm run dev    # tsx watch, Express on http://localhost:5000
cd frontend && npm run dev   # Next.js on http://localhost:3000
```

Typecheck and build each side:

```bash
cd frontend && npm run build   # Next.js typechecks, then builds
cd backend && npm run build    # tsc emits JavaScript to backend/dist
cd backend && npm start        # node dist/index.js
```

In development, Next.js proxies same-origin `/api/*` calls to the Express server on port 5000, so no extra configuration is needed. The frontend needs the API running: it shows only data from the API, and if the API or database is unavailable it shows an error banner instead of pretending changes were saved.

## Deploy on Vercel

Deploy the two folders as two Vercel projects:

**Backend**

1. Import this repo in Vercel with the Root Directory set to `backend`.
2. Set the environment variable `MONGO_DB_URI` to your Atlas connection string.
3. Deploy. `/api/*` is rewritten to the Express app in `backend/api/index.ts`. Note the live backend URL.

**Frontend**

1. Import this repo in Vercel with the Root Directory set to `frontend`.
2. Set the environment variable `NEXT_PUBLIC_API_URL` to the live backend URL from above (for example `https://task-manager-app-backend.vercel.app`).
3. Deploy.

The frontend calls the backend through `NEXT_PUBLIC_API_URL`, so the two deploys stay independent. Leave `NEXT_PUBLIC_API_URL` unset only when the frontend and the API share one origin.

No secret is committed anywhere in this repo — credentials only ever live in environment variables.
