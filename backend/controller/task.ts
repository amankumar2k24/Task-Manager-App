import type { Request, Response } from "express";
import * as taskService from "../service/taskService";
import { handleControllerError } from "../utils/apiResponse";
import { responseMessage } from "../utils/responseMessage";
import type { StatusInput, TaskInput, TaskListQuery, TaskUpdateInput } from "../types/task";

export const createTask = async (req: Request<{}, {}, TaskInput>, res: Response): Promise<Response> => {
    try {
        const task = await taskService.createTask(req.body);
        return res.status(201).json({ message: responseMessage.taskCreated, status: true, response: task });
    } catch (error) {
        return handleControllerError(res, error, "createTask");
    }
};

export const getTasks = async (req: Request<{}, {}, {}, TaskListQuery>, res: Response): Promise<Response> => {
    try {
        const tasks = await taskService.getTasks(req.query);
        return res.status(200).json({ message: responseMessage.tasksFetched, status: true, response: tasks });
    } catch (error) {
        return handleControllerError(res, error, "getTasks");
    }
};

export const getWeekSummary = async (req: Request<{}, {}, {}, TaskListQuery>, res: Response): Promise<Response> => {
    try {
        const summary = await taskService.getWeekSummary(req.query.weekStart);
        return res.status(200).json({ message: responseMessage.weekSummaryFetched, status: true, response: summary });
    } catch (error) {
        return handleControllerError(res, error, "getWeekSummary");
    }
};

export const getTaskById = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        return res.status(200).json({ message: responseMessage.taskFetched, status: true, response: task });
    } catch (error) {
        return handleControllerError(res, error, "getTaskById");
    }
};

export const updateTask = async (req: Request<{ id: string }, {}, TaskUpdateInput>, res: Response): Promise<Response> => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        return res.status(200).json({ message: responseMessage.taskUpdated, status: true, response: task });
    } catch (error) {
        return handleControllerError(res, error, "updateTask");
    }
};

export const deleteTask = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
        const task = await taskService.deleteTask(req.params.id);
        return res.status(200).json({ message: responseMessage.taskDeleted, status: true, response: task });
    } catch (error) {
        return handleControllerError(res, error, "deleteTask");
    }
};

export const toggleStatus = async (req: Request<{ id: string }, {}, StatusInput>, res: Response): Promise<Response> => {
    try {
        const task = await taskService.toggleTaskStatus(req.params.id, req.body.status);
        return res.status(200).json({ message: responseMessage.taskStatusUpdated, status: true, response: task });
    } catch (error) {
        return handleControllerError(res, error, "toggleStatus");
    }
};
