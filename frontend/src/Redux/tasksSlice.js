import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TaskApi from "../Api/TaskApi";
import seedTasks from "../data/seedTasks";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (params = {}) => {
    return TaskApi.getTasks(params);
});

export const fetchWeekSummary = createAsyncThunk("tasks/fetchWeekSummary", async (weekStart) => {
    return TaskApi.getWeekSummary(weekStart);
});

export const createTask = createAsyncThunk("tasks/createTask", async (payload) => {
    try {
        return await TaskApi.createTask(payload);
    } catch (error) {
        const now = new Date().toISOString();
        return { ...payload, id: `local-${Date.now()}`, createdAt: now, updatedAt: now };
    }
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ id, changes }) => {
    try {
        return await TaskApi.updateTask(id, changes);
    } catch (error) {
        return { id, ...changes };
    }
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
    await TaskApi.deleteTask(id).catch(() => {});
    return id;
});

export const toggleTaskStatus = createAsyncThunk(
    "tasks/toggleTaskStatus",
    async ({ id, status }) => {
        try {
            return await TaskApi.toggleTaskStatus(id, status);
        } catch (error) {
            return { id, status };
        }
    }
);

export const searchTasks = createAsyncThunk("tasks/searchTasks", async (query, { getState }) => {
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
});

const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        items: seedTasks,
        searchResults: [],
        summary: { open: 0, completed: 0, total: 0 },
        status: "idle",
        error: null,
    },
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
                state.error = action.error.message;
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
                    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
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
                    task.id === action.payload.id ? { ...task, status: action.payload.status } : task
                );
            })
            .addCase(searchTasks.fulfilled, (state, action) => {
                state.searchResults = action.payload;
            });
    },
});

export const { clearSearch } = tasksSlice.actions;
export default tasksSlice.reducer;
