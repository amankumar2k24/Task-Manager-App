import Joi from "joi";
import type { StatusInput, TaskInput, TaskUpdateInput } from "../types/task";

export const createTaskSchema = Joi.object<TaskInput>({
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().allow("").max(1000),
    dateTime: Joi.date().iso().required(),
    endDateTime: Joi.date().iso().allow(null),
    priority: Joi.string().valid("Low", "Medium", "High"),
    status: Joi.string().valid("Pending", "In Progress", "Completed"),
});

export const updateTaskSchema = Joi.object<TaskUpdateInput>({
    title: Joi.string().trim().min(1).max(200),
    description: Joi.string().allow("").max(1000),
    dateTime: Joi.date().iso(),
    endDateTime: Joi.date().iso().allow(null),
    priority: Joi.string().valid("Low", "Medium", "High"),
    status: Joi.string().valid("Pending", "In Progress", "Completed"),
}).min(1);

export const statusSchema = Joi.object<StatusInput>({
    status: Joi.string().valid("Pending", "In Progress", "Completed").required(),
});
