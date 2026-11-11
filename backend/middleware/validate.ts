import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";
import { responseMessage } from "../utils/responseMessage";

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ message: responseMessage.validationError, status: false, response: error.details[0].message });
        return;
    }
    req.body = value;
    next();
};

export default validate;
