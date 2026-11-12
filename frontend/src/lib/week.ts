import type { Task, WeekGroup, WeekSummary } from "../types/task";

const DAY = 24 * 60 * 60 * 1000;

export const startOfDay = (date: Date): Date => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day;
};

export const startOfWeek = (date: Date): Date => {
    const day = startOfDay(date);
    const offset = (day.getDay() + 6) % 7;
    return new Date(day.getTime() - offset * DAY);
};

export const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY);

export const weekDays = (weekStart: Date): Date[] => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

export const weekStartISO = (date: Date): string => {
    const monday = startOfWeek(date);
    const month = `${monday.getMonth() + 1}`.padStart(2, "0");
    const day = `${monday.getDate()}`.padStart(2, "0");
    return `${monday.getFullYear()}-${month}-${day}`;
};

export const weekStartParam = (date: Date): string => startOfWeek(date).toISOString();

export const isSameDay = (a: Date, b: Date): boolean => startOfDay(a).getTime() === startOfDay(b).getTime();

export const isToday = (date: Date): boolean => isSameDay(date, new Date());

export const isInWeek = (date: Date | string, weekStart: Date): boolean => {
    const time = new Date(date).getTime();
    return time >= weekStart.getTime() && time < weekStart.getTime() + 7 * DAY;
};

export const weekLabel = (weekStart: Date): string => {
    const end = addDays(weekStart, 6);
    const sameMonth = weekStart.getMonth() === end.getMonth();
    const startPart = sameMonth
        ? `${weekStart.getDate()}`
        : `${weekStart.getDate()} ${weekStart.toLocaleDateString("en-GB", { month: "short" })}`;
    return `${startPart} – ${end.getDate()} ${end.toLocaleDateString("en-GB", { month: "short" })} ${end.getFullYear()}`;
};

export const groupTasksByWeek = (tasks: Task[]): WeekGroup[] => {
    const groups = new Map<string, WeekGroup>();
    tasks.forEach((task) => {
        const monday = startOfWeek(new Date(task.dateTime));
        const key = weekStartISO(monday);
        if (!groups.has(key)) groups.set(key, { weekStart: monday, tasks: [] });
        groups.get(key)?.tasks.push(task);
    });
    return [...groups.values()].sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());
};

export const countByStatus = (tasks: Task[]): WeekSummary => ({
    open: tasks.filter((task) => task.status !== "Completed").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
    total: tasks.length,
});
