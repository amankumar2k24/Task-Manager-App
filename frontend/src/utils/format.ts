import type { Task } from "../types/task";

export const formatTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export const formatDateLong = (iso: string): string =>
    new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

export const formatDayName = (date: Date): string =>
    date.toLocaleDateString("en-GB", { weekday: "short" });

export const formatDayHeading = (date: Date): string => {
    const today = new Date();
    const sameDay = (a: Date, b: Date): boolean =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    if (sameDay(date, today)) return "Tasks Today";
    return `Tasks · ${date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}`;
};

export const toDateInputValue = (iso: string): string => {
    const date = new Date(iso);
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
};

export const toTimeInputValue = (iso: string): string => {
    const date = new Date(iso);
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const combineDateTime = (dateValue: string, timeValue: string): string => {
    const [year, month, day] = dateValue.split("-").map(Number);
    const [hours, minutes] = timeValue.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes).toISOString();
};

export const timeRange = (task: Task): string => {
    if (!task.endDateTime) return formatTime(task.dateTime);
    return `${formatTime(task.dateTime)} - ${formatTime(task.endDateTime)}`;
};
