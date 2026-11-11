import { Schema, model } from "mongoose";
import type { Model } from "mongoose";
import type { Priority, TaskStatus } from "../types/task";

export interface TaskAttrs {
    title: string;
    description: string;
    dateTime: Date;
    endDateTime: Date | null;
    priority: Priority;
    status: TaskStatus;
}

const taskSchema = new Schema<TaskAttrs>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    dateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        default: null,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress",
    },
}, { timestamps: true, versionKey: false });

const Task: Model<TaskAttrs> = model<TaskAttrs>("Task", taskSchema);

export default Task;
