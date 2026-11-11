const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

if (MONGO_DB_URI) {
    mongoose.connect(MONGO_DB_URI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log("Error connecting to MongoDB", err.message);
    });
} else {
    console.log("MONGO_DB_URI is not set - API runs without a database");
}

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server health is green and running"
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Task Manager API is running"
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`SERVER is running on PORT ${PORT}`);
    });
}

module.exports = app;
