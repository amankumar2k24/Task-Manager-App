import type { Response } from "express";
import { AppError } from "./appError";
import { responseMessage } from "./responseMessage";

export const handleControllerError = (res: Response, error: unknown, context: string): Response => {
    console.log(`error from ${context} Api==>`, error);
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message, status: false });
    }
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: responseMessage.internalServerError, status: false, error: detail });
};
