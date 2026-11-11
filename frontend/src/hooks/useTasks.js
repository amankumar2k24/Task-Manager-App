import { useDispatch, useSelector } from "react-redux";
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

export const useTasks = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks);
    const nextStatus = (task) => (task.status === "Completed" ? "In Progress" : "Completed");

    return {
        ...tasks,
        loadTasks: (params) => dispatch(fetchTasks(params)),
        loadWeekSummary: (weekStart) => dispatch(fetchWeekSummary(weekStart)),
        addTask: (payload) => dispatch(createTask(payload)),
        editTask: (id, changes) => dispatch(updateTask({ id, changes })),
        removeTask: (id) => dispatch(deleteTask(id)),
        toggleTask: (task) => dispatch(toggleTaskStatus({ id: task.id, status: nextStatus(task) })),
        search: (query) => dispatch(searchTasks(query)),
        clearSearch: () => dispatch(clearSearch()),
    };
};
