import type { AxiosResponse } from "axios";
import type { Task } from "../types/task";

type TaskLike = Omit<Task, "id"> & { _id?: string; id?: string };

export const normalizeTask = (task: unknown): Task | null | undefined => {
    if (task === null || task === undefined) return task;
    if (typeof task !== "object") return undefined;
    const record = task as TaskLike;
    const { _id, ...rest } = record;
    return { ...rest, id: record.id || _id || "" };
};

export const normalizeTasks = (tasks: unknown): Task[] => {
    if (!Array.isArray(tasks)) return [];
    return tasks
        .map((task) => normalizeTask(task as TaskLike))
        .filter((task): task is Task => task !== null && task !== undefined);
};

export const unwrap = (res: AxiosResponse): unknown => res.data?.response ?? res.data;

export const apiErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        return axiosError.response?.data?.message || axiosError.message || "Something went wrong";
    }
    return "Something went wrong";
};
