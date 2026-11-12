import mongoose from "mongoose";
import { AppError } from "./appError";
import { responseMessage } from "./responseMessage";

export const ensureDbReady = (): void => {
    if (mongoose.connection.readyState !== 1) {
        throw new AppError(503, responseMessage.databaseNotConnected);
    }
};

export const ensureValidId = (id: string): void => {
    if (!mongoose.isValidObjectId(id)) throw new AppError(404, responseMessage.taskNotFound);
};
