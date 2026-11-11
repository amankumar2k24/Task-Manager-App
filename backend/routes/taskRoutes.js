const express = require("express");
const { createTask, getTasks, getWeekSummary, getTaskById, updateTask, deleteTask, toggleStatus } = require("../controller/task");
const validate = require("../middleware/validate");
const { createTaskSchema, updateTaskSchema, statusSchema } = require("../validation/taskValidation");

const router = express.Router();

router.get("/summary", getWeekSummary);
router.get("/", getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.get("/:id", getTaskById);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:id/status", validate(statusSchema), toggleStatus);
router.delete("/:id", deleteTask);

module.exports = router;
