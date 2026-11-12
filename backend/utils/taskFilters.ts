import type { FilterQuery } from "mongoose";
import type { TaskAttrs } from "../model/task";
import { AppError } from "./appError";
import { responseMessage } from "./responseMessage";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const weekRange = (weekStart: string): { start: Date; end: Date } => {
    const start = new Date(DATE_ONLY.test(weekStart) ? `${weekStart}T00:00:00.000Z` : weekStart);
    if (Number.isNaN(start.getTime())) throw new AppError(400, responseMessage.invalidWeekStart);
    return { start, end: new Date(start.getTime() + WEEK_MS) };
};

export const searchFilter = (search?: string): FilterQuery<TaskAttrs> => {
    if (!search) return {};
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "i");
    return { $or: [{ title: pattern }, { description: pattern }] };
};

export const weekFilter = (weekStart?: string): FilterQuery<TaskAttrs> => {
    if (!weekStart) return {};
    const { start, end } = weekRange(weekStart);
    return { dateTime: { $gte: start, $lt: end } };
};
