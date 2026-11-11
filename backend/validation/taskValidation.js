const Joi = require("joi");

exports.createTaskSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().allow("").max(1000),
    dateTime: Joi.date().iso().required(),
    endDateTime: Joi.date().iso().allow(null),
    priority: Joi.string().valid("Low", "Medium", "High"),
    status: Joi.string().valid("In Progress", "Completed")
});

exports.updateTaskSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200),
    description: Joi.string().allow("").max(1000),
    dateTime: Joi.date().iso(),
    endDateTime: Joi.date().iso().allow(null),
    priority: Joi.string().valid("Low", "Medium", "High"),
    status: Joi.string().valid("In Progress", "Completed")
}).min(1);

exports.statusSchema = Joi.object({
    status: Joi.string().valid("In Progress", "Completed").required()
});
