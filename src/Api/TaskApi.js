import apiInstance from "./apiInstance";
import { normalizeTask, normalizeTasks, unwrap } from "./CommonApi";

const TaskApi = {
    getTasks: async (params = {}) => {
        const res = await apiInstance.get("/tasks", { params });
        return normalizeTasks(unwrap(res));
    },
    getWeekSummary: async (weekStart) => {
        const res = await apiInstance.get("/tasks/summary", { params: { weekStart } });
        return unwrap(res);
    },
    createTask: async (payload) => {
        const res = await apiInstance.post("/tasks", payload);
        return normalizeTask(unwrap(res));
    },
    updateTask: async (id, payload) => {
        const res = await apiInstance.put(`/tasks/${id}`, payload);
        return normalizeTask(unwrap(res));
    },
    deleteTask: async (id) => {
        await apiInstance.delete(`/tasks/${id}`);
        return id;
    },
    toggleTaskStatus: async (id, status) => {
        const res = await apiInstance.patch(`/tasks/${id}/status`, { status });
        return normalizeTask(unwrap(res));
    },
    searchTasks: async (query) => {
        const res = await apiInstance.get("/tasks", { params: { search: query } });
        return normalizeTasks(unwrap(res));
    },
};

export default TaskApi;
