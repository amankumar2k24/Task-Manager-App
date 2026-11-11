import type { Task } from "../types/task";

const at = (hour: number, minute = 0): string => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
};

const seedTasks: Task[] = [
    {
        id: "seed-1",
        title: "Finishing Wireframe",
        description: "Complete the wireframe for the to-do app home screen.",
        dateTime: at(10, 0),
        endDateTime: at(11, 0),
        priority: "Medium",
        status: "In Progress",
        createdAt: at(8, 0),
        updatedAt: at(8, 0),
    },
    {
        id: "seed-2",
        title: "Meeting with team",
        description: "Daily sync with the design team.",
        dateTime: at(14, 0),
        endDateTime: at(15, 0),
        priority: "High",
        status: "In Progress",
        createdAt: at(8, 5),
        updatedAt: at(8, 5),
    },
    {
        id: "seed-3",
        title: "Buy a cat food",
        description: "",
        dateTime: at(9, 0),
        endDateTime: at(9, 30),
        priority: "Low",
        status: "Completed",
        createdAt: at(8, 10),
        updatedAt: at(9, 5),
    },
    {
        id: "seed-4",
        title: "Finishing daily commission",
        description: "Wrap up the daily commission tasks.",
        dateTime: at(18, 0),
        endDateTime: at(19, 0),
        priority: "Medium",
        status: "Completed",
        createdAt: at(8, 15),
        updatedAt: at(18, 20),
    },
];

export default seedTasks;
