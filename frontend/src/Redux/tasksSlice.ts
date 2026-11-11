import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TaskApi from "../Api/TaskApi";
import seedTasks from "../data/seedTasks";
import type { RootState } from "./store";
import type { Task, TaskInput, TaskQueryParams, TaskStatus, TaskUpdate, WeekSummary } from "../types/task";

export type TasksStatus = "idle" | "loading" | "succeeded" | "failed";

export interface TasksState {
    items: Task[];
    searchResults: Task[];
    summary: WeekSummary;
    status: TasksStatus;
    error: string | null;
}

const initialState: TasksState = {
    items: seedTasks,
    searchResults: [],
    summary: { open: 0, completed: 0, total: 0 },
    status: "idle",
    error: null,
};

export const fetchTasks = createAsyncThunk<Task[], TaskQueryParams>("tasks/fetchTasks", async (params: TaskQueryParams = {}) => {
    return TaskApi.getTasks(params);
});

export const fetchWeekSummary = createAsyncThunk<WeekSummary, string>("tasks/fetchWeekSummary", async (weekStart: string) => {
    return TaskApi.getWeekSummary(weekStart);
});

export const createTask = createAsyncThunk<Task, TaskInput>("tasks/createTask", async (payload: TaskInput) => {
    try {
        return await TaskApi.createTask(payload);
    } catch (error) {
        const now = new Date().toISOString();
        return { ...payload, id: `local-${Date.now()}`, status: "In Progress" as const, createdAt: now, updatedAt: now };
    }
});

export const updateTask = createAsyncThunk<Partial<Task> & { id: string }, { id: string; changes: TaskUpdate }>(
    "tasks/updateTask",
    async ({ id, changes }) => {
        try {
            return await TaskApi.updateTask(id, changes);
        } catch (error) {
            return { id, ...changes };
        }
    }
);

export const deleteTask = createAsyncThunk<string, string>("tasks/deleteTask", async (id: string) => {
    await TaskApi.deleteTask(id).catch(() => {});
    return id;
});

export const toggleTaskStatus = createAsyncThunk<Partial<Task> & { id: string }, { id: string; status: TaskStatus }>(
    "tasks/toggleTaskStatus",
    async ({ id, status }) => {
        try {
            return await TaskApi.toggleTaskStatus(id, status);
        } catch (error) {
            return { id, status };
        }
    }
);

export const searchTasks = createAsyncThunk<Task[], string, { state: RootState }>(
    "tasks/searchTasks",
    async (query: string, { getState }) => {
        const trimmed = query.trim();
        if (!trimmed) return [];
        try {
            return await TaskApi.searchTasks(trimmed);
        } catch (error) {
            const needle = trimmed.toLowerCase();
            return getState().tasks.items.filter(
                (task) =>
                    task.title.toLowerCase().includes(needle) ||
                    (task.description || "").toLowerCase().includes(needle)
            );
        }
    }
);

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.searchResults = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
                state.error = null;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? null;
            })
            .addCase(fetchWeekSummary.fulfilled, (state, action) => {
                state.summary = action.payload;
            })
            .addCase(fetchWeekSummary.rejected, (state) => {
                const open = state.items.filter((task) => task.status !== "Completed").length;
                state.summary = { open, completed: state.items.length - open, total: state.items.length };
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.items = [...state.items, action.payload].sort(
                    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
                );
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.items = state.items.map((task) =>
                    task.id === action.payload.id ? { ...task, ...action.payload } : task
                );
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter((task) => task.id !== action.payload);
                state.searchResults = state.searchResults.filter((task) => task.id !== action.payload);
            })
            .addCase(toggleTaskStatus.fulfilled, (state, action) => {
                state.items = state.items.map((task) =>
                    task.id === action.payload.id ? { ...task, status: action.payload.status ?? task.status } : task
                );
            })
            .addCase(searchTasks.fulfilled, (state, action) => {
                state.searchResults = action.payload;
            });
    },
});

export const { clearSearch } = tasksSlice.actions;
export default tasksSlice.reducer;
