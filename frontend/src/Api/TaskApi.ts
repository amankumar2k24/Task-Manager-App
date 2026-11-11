import apiInstance from "./apiInstance";
import { normalizeTask, normalizeTasks, unwrap } from "./CommonApi";
import type { Task, TaskInput, TaskQueryParams, TaskStatus, TaskUpdate, WeekSummary } from "../types/task";

const TaskApi = {
    getTasks: async (params: TaskQueryParams = {}): Promise<Task[]> => {
        const res = await apiInstance.get("/tasks", { params });
        return normalizeTasks(unwrap(res));
    },
    getWeekSummary: async (weekStart: string): Promise<WeekSummary> => {
        const res = await apiInstance.get("/tasks/summary", { params: { weekStart } });
        return unwrap(res) as WeekSummary;
    },
    createTask: async (payload: TaskInput): Promise<Task> => {
        const res = await apiInstance.post("/tasks", payload);
        return normalizeTask(unwrap(res)) as Task;
    },
    updateTask: async (id: string, payload: TaskUpdate): Promise<Task> => {
        const res = await apiInstance.put(`/tasks/${id}`, payload);
        return normalizeTask(unwrap(res)) as Task;
    },
    deleteTask: async (id: string): Promise<string> => {
        await apiInstance.delete(`/tasks/${id}`);
        return id;
    },
    toggleTaskStatus: async (id: string, status: TaskStatus): Promise<Task> => {
        const res = await apiInstance.patch(`/tasks/${id}/status`, { status });
        return normalizeTask(unwrap(res)) as Task;
    },
    searchTasks: async (query: string): Promise<Task[]> => {
        const res = await apiInstance.get("/tasks", { params: { search: query } });
        return normalizeTasks(unwrap(res));
    },
};

export default TaskApi;
