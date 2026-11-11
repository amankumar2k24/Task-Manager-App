import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { FilterQuery } from "mongoose";
import Task from "../model/task";
import type { TaskAttrs } from "../model/task";
import type { StatusInput, TaskInput, TaskUpdateInput, WeekSummaryResponse } from "../types/task";

const dbReady = (): boolean => mongoose.connection.readyState === 1;

const dbUnavailable = (res: Response): Response =>
    res.status(503).json({ message: "Database is not connected", status: false });

const errorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : "Unknown error";

const weekRange = (weekStart: string): { start: Date; end: Date } => {
    const start = new Date(`${weekStart}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return { start, end };
};

const searchFilter = (search?: string): FilterQuery<TaskAttrs> => {
    if (!search) return {};
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "i");
    return { $or: [{ title: pattern }, { description: pattern }] };
};

export const createTask = async (req: Request<{}, {}, TaskInput>, res: Response): Promise<Response> => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.create(req.body);
        return res.status(201).json({ message: "Task created successfully", status: true, response: task });
    } catch (error) {
        console.log("error from createTask Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: errorMessage(error) });
    }
};

export const getTasks = async (
    req: Request<{}, {}, {}, { search?: string; weekStart?: string }>,
    res: Response
): Promise<Response> => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const { search, weekStart } = req.query;
        const filter: FilterQuery<TaskAttrs> = searchFilter(search);
        if (weekStart) {
            const { start, end } = weekRange(weekStart);
            filter.dateTime = { $gte: start, $lt: end };
        }
        const tasks = await Task.find(filter).sort({ dateTime: 1 });
        return res.status(200).json({ message: "Tasks fetched successfully", status: true, response: tasks });
    } catch (error) {
        console.log("error from getTasks Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: errorMessage(error) });
    }
};

export const getWeekSummary = async (
    req: Request<{}, {}, {}, { weekStart?: string }>,
    res: Response
): Promise<Response> => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const { weekStart } = req.query;
        const filter: FilterQuery<TaskAttrs> = {};
        if (weekStart) {
            const { start, end } = weekRange(weekStart);
            filter.dateTime = { $gte: start, $lt: end };
        }
        const [open, completed] = await Promise.all([
            Task.countDocuments({ ...filter, status: "In Progress" }),
            Task.countDocuments({ ...filter, status: "Completed" }),
        ]);
        const summary: WeekSummaryResponse = { open, completed, total: open + completed };
        return res.status(200).json({ message: "Week summary fetched successfully", status: true, response: summary });
    } catch (error) {
        console.log("error from getWeekSummary Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: errorMessage(error) });
    }
};

export const getTaskById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task fetched successfully", status: true, response: task });
    } catch (error) {
        console.log("error from getTaskById Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: errorMessage(error) });
    }
};

export const updateTask = async (req: Request<{ id: string }, {}, TaskUpdateInput>, res: Response): Promise<Response> => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task updated successfully", status: true, response: task });
    } catch (error) {
        console.log("error from updateTask Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: errorMessage(error) });
    }
};

export const deleteTask = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task deleted successfully", status: true, response: task });
    } catch (error) {
        console.log("error from deleteTask Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: errorMessage(error) });
    }
};

export const toggleStatus = async (req: Request<{ id: string }, {}, StatusInput>, res: Response): Promise<Response> => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task status updated successfully", status: true, response: task });
    } catch (error) {
        console.log("error from toggleStatus Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: errorMessage(error) });
    }
};
