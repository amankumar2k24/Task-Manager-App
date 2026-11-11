import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;
const MONGO_DB_URI: string | undefined = process.env.MONGO_DB_URI;

if (MONGO_DB_URI) {
    mongoose.connect(MONGO_DB_URI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log("Error connecting to MongoDB", err.message);
    });
} else {
    console.log("MONGO_DB_URI is not set - API runs without a database");
}

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server health is green and running",
    });
});

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Task Manager API is running",
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`SERVER is running on PORT ${PORT}`);
    });
}

export default app;
