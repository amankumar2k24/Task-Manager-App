import { useAppDispatch, useAppSelector } from "../Redux/store";
import { clearError, clearSearch, createTask, deleteTask, fetchTasks, fetchWeekSummary, searchTasks, toggleTaskStatus, updateTask, } from "../Redux/tasksSlice";
import type { Task, TaskInput, TaskQueryParams, TaskStatus, TaskUpdate } from "../types/task";

export const useTasks = () => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks);
    const nextStatus = (task: Task): TaskStatus => (task.status === "Completed" ? "Pending" : "Completed");
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
        setTaskStatus: async (task: Task, status: TaskStatus): Promise<boolean> =>
            succeeded(await dispatch(toggleTaskStatus({ id: task.id, status }))),
        search: (query: string) => dispatch(searchTasks(query)),
        clearSearch: () => dispatch(clearSearch()),
        clearError: () => dispatch(clearError()),
    };
};
