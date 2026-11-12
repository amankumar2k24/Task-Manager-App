import express from "express";
import { createTask, deleteTask, getTaskById, getTasks, getWeekSummary, toggleStatus, updateTask } from "../controller/task";
import dbReady from "../middleware/dbReady";
import validate from "../middleware/validate";
import { createTaskSchema, statusSchema, updateTaskSchema } from "../validation/taskValidation";

const router = express.Router();

router.use(dbReady);

router.get("/summary", getWeekSummary);
router.get("/", getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.get("/:id", getTaskById);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:id/status", validate(statusSchema), toggleStatus);
router.delete("/:id", deleteTask);

export default router;
