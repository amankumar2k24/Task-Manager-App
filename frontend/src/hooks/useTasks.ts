import { useAppDispatch, useAppSelector } from "../Redux/store";
import {
    clearError,
    clearSearch,
    createTask,
    deleteTask,
    fetchTasks,
    fetchWeekSummary,
    searchTasks,
    toggleTaskStatus,
    updateTask,
} from "../Redux/tasksSlice";
import type { Task, TaskInput, TaskQueryParams, TaskStatus, TaskUpdate } from "../types/task";

// Mutations return a promise that resolves to true when the API saved the change and false
// when it failed (the failure message is shown by the global ErrorBanner).
export const useTasks = () => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks);
    const nextStatus = (task: Task): TaskStatus => (task.status === "Completed" ? "In Progress" : "Completed");
    const succeeded = (result: { meta: { requestStatus: string } }): boolean => result.meta.requestStatus === "fulfilled";

    return {
        ...tasks,
        loadTasks: (params: TaskQueryParams) => dispatch(fetchTasks(params)),
        loadWeekSummary: (weekStart: string) => dispatch(fetchWeekSummary(weekStart)),
        addTask: async (payload: TaskInput): Promise<boolean> => succeeded(await dispatch(createTask(payload))),
        editTask: async (id: string, changes: TaskUpdate): Promise<boolean> =>
            succeeded(await dispatch(updateTask({ id, changes }))),
        removeTask: async (id: string): Promise<boolean> => succeeded(await dispatch(deleteTask(id))),
        toggleTask: async (task: Task): Promise<boolean> =>
            succeeded(await dispatch(toggleTaskStatus({ id: task.id, status: nextStatus(task) }))),
        search: (query: string) => dispatch(searchTasks(query)),
        clearSearch: () => dispatch(clearSearch()),
        clearError: () => dispatch(clearError()),
    };
};
