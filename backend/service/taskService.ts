import type { FilterQuery, HydratedDocument } from "mongoose";
import Task from "../model/task";
import type { TaskAttrs } from "../model/task";
import { AppError } from "../utils/appError";
import { responseMessage } from "../utils/responseMessage";
import { ensureValidId } from "../utils/dbGuard";
import { searchFilter, weekFilter } from "../utils/taskFilters";
import type { TaskInput, TaskListQuery, TaskStatus, TaskUpdateInput, WeekSummaryResponse } from "../types/task";

export const createTask = async (input: TaskInput): Promise<HydratedDocument<TaskAttrs>> => {
    return Task.create(input);
};

export const getTasks = async (query: TaskListQuery): Promise<HydratedDocument<TaskAttrs>[]> => {
    const filter: FilterQuery<TaskAttrs> = { ...searchFilter(query.search), ...weekFilter(query.weekStart) };
    return Task.find(filter).sort({ dateTime: 1 }).limit(1000);
};

export const getWeekSummary = async (weekStart?: string): Promise<WeekSummaryResponse> => {
    const filter = weekFilter(weekStart);
    const [open, completed] = await Promise.all([
        Task.countDocuments({ ...filter, status: { $ne: "Completed" } }),
        Task.countDocuments({ ...filter, status: "Completed" }),
    ]);
    return { open, completed, total: open + completed };
};

export const getTaskById = async (id: string): Promise<HydratedDocument<TaskAttrs>> => {
    ensureValidId(id);
    const task = await Task.findById(id);
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};

export const updateTask = async (id: string, changes: TaskUpdateInput): Promise<HydratedDocument<TaskAttrs>> => {
    ensureValidId(id);
    const task = await Task.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};

export const deleteTask = async (id: string): Promise<HydratedDocument<TaskAttrs>> => {
    ensureValidId(id);
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};

export const toggleTaskStatus = async (id: string, status: TaskStatus): Promise<HydratedDocument<TaskAttrs>> => {
    ensureValidId(id);
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};
