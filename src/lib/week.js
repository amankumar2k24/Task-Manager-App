const DAY = 24 * 60 * 60 * 1000;

export const startOfDay = (date) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day;
};

export const startOfWeek = (date) => {
    const day = startOfDay(date);
    const offset = (day.getDay() + 6) % 7;
    return new Date(day.getTime() - offset * DAY);
};

export const addDays = (date, days) => new Date(date.getTime() + days * DAY);

export const weekDays = (weekStart) => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

export const weekStartISO = (date) => {
    const monday = startOfWeek(date);
    return monday.toISOString().slice(0, 10);
};

export const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

export const isToday = (date) => isSameDay(date, new Date());

export const isInWeek = (date, weekStart) => {
    const time = new Date(date).getTime();
    return time >= weekStart.getTime() && time < weekStart.getTime() + 7 * DAY;
};

export const weekLabel = (weekStart) => {
    const end = addDays(weekStart, 6);
    const sameMonth = weekStart.getMonth() === end.getMonth();
    const startPart = sameMonth
        ? `${weekStart.getDate()}`
        : `${weekStart.getDate()} ${weekStart.toLocaleDateString("en-GB", { month: "short" })}`;
    return `${startPart} – ${end.getDate()} ${end.toLocaleDateString("en-GB", { month: "short" })} ${end.getFullYear()}`;
};

export const groupTasksByWeek = (tasks) => {
    const groups = new Map();
    tasks.forEach((task) => {
        const monday = startOfWeek(new Date(task.dateTime));
        const key = monday.toISOString();
        if (!groups.has(key)) groups.set(key, { weekStart: monday, tasks: [] });
        groups.get(key).tasks.push(task);
    });
    return [...groups.values()].sort((a, b) => b.weekStart - a.weekStart);
};

export const countByStatus = (tasks) => ({
    open: tasks.filter((task) => task.status !== "Completed").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
    total: tasks.length,
});
