import { useAppDispatch, useAppSelector } from "../Redux/store";
import {
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

export const useTasks = () => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks);
    const nextStatus = (task: Task): TaskStatus => (task.status === "Completed" ? "In Progress" : "Completed");

    return {
        ...tasks,
        loadTasks: (params: TaskQueryParams) => dispatch(fetchTasks(params)),
        loadWeekSummary: (weekStart: string) => dispatch(fetchWeekSummary(weekStart)),
        addTask: (payload: TaskInput) => dispatch(createTask(payload)),
        editTask: (id: string, changes: TaskUpdate) => dispatch(updateTask({ id, changes })),
        removeTask: (id: string) => dispatch(deleteTask(id)),
        toggleTask: (task: Task) => dispatch(toggleTaskStatus({ id: task.id, status: nextStatus(task) })),
        search: (query: string) => dispatch(searchTasks(query)),
        clearSearch: () => dispatch(clearSearch()),
    };
};
