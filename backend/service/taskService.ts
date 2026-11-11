import mongoose from "mongoose";
import type { FilterQuery, HydratedDocument } from "mongoose";
import Task from "../model/task";
import type { TaskAttrs } from "../model/task";
import { AppError } from "../utils/appError";
import { responseMessage } from "../utils/responseMessage";
import type { TaskInput, TaskListQuery, TaskStatus, TaskUpdateInput, WeekSummaryResponse } from "../types/task";

const ensureDbReady = (): void => {
    if (mongoose.connection.readyState !== 1) {
        throw new AppError(503, responseMessage.databaseNotConnected);
    }
};

// A malformed id can never match a task, so answer 404 instead of letting Mongoose's
// CastError surface as a 500.
const ensureValidId = (id: string): void => {
    if (!mongoose.isValidObjectId(id)) throw new AppError(404, responseMessage.taskNotFound);
};

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// weekStart is either a full ISO instant (the client's local Monday 00:00, e.g.
// "2026-11-08T18:30:00.000Z" for IST) or a plain "YYYY-MM-DD", read as Monday 00:00 UTC.
// Sending the instant keeps week boundaries correct in every timezone.
const weekRange = (weekStart: string): { start: Date; end: Date } => {
    const start = new Date(DATE_ONLY.test(weekStart) ? `${weekStart}T00:00:00.000Z` : weekStart);
    if (Number.isNaN(start.getTime())) throw new AppError(400, responseMessage.invalidWeekStart);
    return { start, end: new Date(start.getTime() + WEEK_MS) };
};

const searchFilter = (search?: string): FilterQuery<TaskAttrs> => {
    if (!search) return {};
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "i");
    return { $or: [{ title: pattern }, { description: pattern }] };
};

const weekFilter = (weekStart?: string): FilterQuery<TaskAttrs> => {
    if (!weekStart) return {};
    const { start, end } = weekRange(weekStart);
    return { dateTime: { $gte: start, $lt: end } };
};

export const createTask = async (input: TaskInput): Promise<HydratedDocument<TaskAttrs>> => {
    ensureDbReady();
    return Task.create(input);
};

export const getTasks = async (query: TaskListQuery): Promise<HydratedDocument<TaskAttrs>[]> => {
    ensureDbReady();
    const filter: FilterQuery<TaskAttrs> = { ...searchFilter(query.search), ...weekFilter(query.weekStart) };
    return Task.find(filter).sort({ dateTime: 1 }).limit(1000);
};

export const getWeekSummary = async (weekStart?: string): Promise<WeekSummaryResponse> => {
    ensureDbReady();
    const filter = weekFilter(weekStart);
    const [open, completed] = await Promise.all([
        Task.countDocuments({ ...filter, status: "In Progress" }),
        Task.countDocuments({ ...filter, status: "Completed" }),
    ]);
    return { open, completed, total: open + completed };
};

export const getTaskById = async (id: string): Promise<HydratedDocument<TaskAttrs>> => {
    ensureDbReady();
    ensureValidId(id);
    const task = await Task.findById(id);
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};

export const updateTask = async (id: string, changes: TaskUpdateInput): Promise<HydratedDocument<TaskAttrs>> => {
    ensureDbReady();
    ensureValidId(id);
    const task = await Task.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};

export const deleteTask = async (id: string): Promise<HydratedDocument<TaskAttrs>> => {
    ensureDbReady();
    ensureValidId(id);
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};

export const toggleTaskStatus = async (id: string, status: TaskStatus): Promise<HydratedDocument<TaskAttrs>> => {
    ensureDbReady();
    ensureValidId(id);
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) throw new AppError(404, responseMessage.taskNotFound);
    return task;
};
