import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import TaskApi from "../Api/TaskApi";
import { apiErrorMessage } from "../Api/CommonApi";
import type { Task, TaskInput, TaskQueryParams, TaskStatus, TaskUpdate, WeekSummary } from "../types/task";

export type TasksStatus = "idle" | "loading" | "succeeded" | "failed";

export interface TasksState {
    items: Task[];
    searchResults: Task[];
    summary: WeekSummary;
    status: TasksStatus;
    searchStatus: TasksStatus;
    error: string | null;
}

const initialState: TasksState = {
    items: [],
    searchResults: [],
    summary: { open: 0, completed: 0, total: 0 },
    status: "idle",
    searchStatus: "idle",
    error: null,
};

type Rejected = { rejectValue: string };

export const fetchTasks = createAsyncThunk<Task[], TaskQueryParams, Rejected>(
    "tasks/fetchTasks",
    async (params, { rejectWithValue }) => {
        try {
            return await TaskApi.getTasks(params);
        } catch (error) {
            return rejectWithValue(`Couldn't load tasks: ${apiErrorMessage(error)}`);
        }
    }
);

export const fetchWeekSummary = createAsyncThunk<WeekSummary, string, Rejected>(
    "tasks/fetchWeekSummary",
    async (weekStart, { rejectWithValue }) => {
        try {
            return await TaskApi.getWeekSummary(weekStart);
        } catch (error) {
            return rejectWithValue(`Couldn't load the week summary: ${apiErrorMessage(error)}`);
        }
    }
);

export const createTask = createAsyncThunk<Task, TaskInput, Rejected>(
    "tasks/createTask",
    async (payload, { rejectWithValue }) => {
        try {
            return await TaskApi.createTask(payload);
        } catch (error) {
            return rejectWithValue(`Couldn't create the task: ${apiErrorMessage(error)}`);
        }
    }
);

export const updateTask = createAsyncThunk<Task, { id: string; changes: TaskUpdate }, Rejected>(
    "tasks/updateTask",
    async ({ id, changes }, { rejectWithValue }) => {
        try {
            return await TaskApi.updateTask(id, changes);
        } catch (error) {
            return rejectWithValue(`Couldn't save the task: ${apiErrorMessage(error)}`);
        }
    }
);

export const deleteTask = createAsyncThunk<string, string, Rejected>(
    "tasks/deleteTask",
    async (id, { rejectWithValue }) => {
        try {
            return await TaskApi.deleteTask(id);
        } catch (error) {
            return rejectWithValue(`Couldn't delete the task: ${apiErrorMessage(error)}`);
        }
    }
);

export const toggleTaskStatus = createAsyncThunk<Task, { id: string; status: TaskStatus }, Rejected>(
    "tasks/toggleTaskStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            return await TaskApi.toggleTaskStatus(id, status);
        } catch (error) {
            return rejectWithValue(`Couldn't update the task status: ${apiErrorMessage(error)}`);
        }
    }
);

export const searchTasks = createAsyncThunk<Task[], string, Rejected>(
    "tasks/searchTasks",
    async (query, { rejectWithValue }) => {
        const trimmed = query.trim();
        if (!trimmed) return [];
        try {
            return await TaskApi.searchTasks(trimmed);
        } catch (error) {
            return rejectWithValue(`Search failed: ${apiErrorMessage(error)}`);
        }
    }
);

const byDate = (a: Task, b: Task): number => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.searchResults = [];
            state.searchStatus = "idle";
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const replace = (state: TasksState, updated: Task): void => {
            const apply = (task: Task): Task => (task.id === updated.id ? { ...task, ...updated } : task);
            state.items = state.items.map(apply).sort(byDate);
            state.searchResults = state.searchResults.map(apply);
        };
        const fail = (state: TasksState, action: PayloadAction<string | undefined>): void => {
            state.error = action.payload ?? "Something went wrong";
        };

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
                fail(state, action);
            })
            .addCase(fetchWeekSummary.fulfilled, (state, action) => {
                state.summary = action.payload;
            })
            .addCase(fetchWeekSummary.rejected, fail)
            .addCase(createTask.fulfilled, (state, action) => {
                state.items = [...state.items, action.payload].sort(byDate);
            })
            .addCase(createTask.rejected, fail)
            .addCase(updateTask.fulfilled, (state, action) => replace(state, action.payload))
            .addCase(updateTask.rejected, fail)
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter((task) => task.id !== action.payload);
                state.searchResults = state.searchResults.filter((task) => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, fail)
            .addCase(toggleTaskStatus.fulfilled, (state, action) => replace(state, action.payload))
            .addCase(toggleTaskStatus.rejected, fail)
            .addCase(searchTasks.pending, (state) => {
                state.searchStatus = "loading";
            })
            .addCase(searchTasks.fulfilled, (state, action) => {
                state.searchStatus = "succeeded";
                state.searchResults = action.payload;
            })
            .addCase(searchTasks.rejected, (state, action) => {
                state.searchStatus = "failed";
                fail(state, action);
            });
    },
});

export const { clearSearch, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
