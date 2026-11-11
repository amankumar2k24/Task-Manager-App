const mongoose = require("mongoose");
const Task = require("../model/task");

const dbReady = () => mongoose.connection.readyState === 1;

const dbUnavailable = (res) => res.status(503).json({ message: "Database is not connected", status: false });

const weekRange = (weekStart) => {
    const start = new Date(`${weekStart}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return { start, end };
};

const searchFilter = (search) => {
    if (!search) return {};
    const pattern = new RegExp(search.trim(), "i");
    return { $or: [{ title: pattern }, { description: pattern }] };
};

exports.createTask = async (req, res) => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.create(req.body);
        return res.status(201).json({ message: "Task created successfully", status: true, response: task });
    } catch (error) {
        console.log("error from createTask Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const { search, weekStart } = req.query;
        const filter = searchFilter(search);
        if (weekStart) {
            const { start, end } = weekRange(weekStart);
            filter.dateTime = { $gte: start, $lt: end };
        }
        const tasks = await Task.find(filter).sort({ dateTime: 1 });
        return res.status(200).json({ message: "Tasks fetched successfully", status: true, response: tasks });
    } catch (error) {
        console.log("error from getTasks Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: error.message });
    }
};

exports.getWeekSummary = async (req, res) => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const { weekStart } = req.query;
        const filter = {};
        if (weekStart) {
            const { start, end } = weekRange(weekStart);
            filter.dateTime = { $gte: start, $lt: end };
        }
        const [open, completed] = await Promise.all([
            Task.countDocuments({ ...filter, status: "In Progress" }),
            Task.countDocuments({ ...filter, status: "Completed" }),
        ]);
        return res.status(200).json({ message: "Week summary fetched successfully", status: true, response: { open, completed, total: open + completed } });
    } catch (error) {
        console.log("error from getWeekSummary Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task fetched successfully", status: true, response: task });
    } catch (error) {
        console.log("error from getTaskById Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task updated successfully", status: true, response: task });
    } catch (error) {
        console.log("error from updateTask Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task deleted successfully", status: true, response: task });
    } catch (error) {
        console.log("error from deleteTask Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: error.message });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        if (!dbReady()) return dbUnavailable(res);
        const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found", status: false });
        return res.status(200).json({ message: "Task status updated successfully", status: true, response: task });
    } catch (error) {
        console.log("error from toggleStatus Api==>", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, error: error.message });
    }
};
