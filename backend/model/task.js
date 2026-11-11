const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    dateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        default: null
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress"
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Task", taskSchema);
