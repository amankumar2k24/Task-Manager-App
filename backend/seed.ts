import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./model/task";
import type { TaskAttrs } from "./model/task";

dotenv.config();

const at = (hour: number, minute = 0): Date => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
};

const seedTasks: TaskAttrs[] = [
    {
        title: "Finishing Wireframe",
        description: "Complete the wireframe for the to-do app home screen.",
        dateTime: at(10, 0),
        endDateTime: at(11, 0),
        priority: "Medium",
        status: "Pending",
    },
    {
        title: "Meeting with team",
        description: "Daily sync with the design team.",
        dateTime: at(14, 0),
        endDateTime: at(15, 0),
        priority: "High",
        status: "In Progress",
    },
    {
        title: "Buy a cat food",
        description: "",
        dateTime: at(9, 0),
        endDateTime: at(9, 30),
        priority: "Low",
        status: "Completed",
    },
    {
        title: "Finishing daily commission",
        description: "Wrap up the daily commission tasks.",
        dateTime: at(18, 0),
        endDateTime: at(19, 0),
        priority: "Medium",
        status: "Completed",
    },
];

const seed = async (): Promise<void> => {
    const uri = process.env.MONGO_DB_URI;
    if (!uri) {
        console.log("MONGO_DB_URI is not set - cannot seed");
        process.exit(1);
    }
    await mongoose.connect(uri);
    const count = await Task.countDocuments();
    if (count > 0) {
        console.log(`Tasks collection already has ${count} task(s) - skipping seed`);
    } else {
        await Task.insertMany(seedTasks);
        console.log("Seeded 4 tasks");
    }
    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((error: unknown) => {
    console.log("Seed failed", error);
    process.exit(1);
});
