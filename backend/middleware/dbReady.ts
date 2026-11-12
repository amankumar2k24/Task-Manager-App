import type { NextFunction, Request, Response } from "express";
import { handleControllerError } from "../utils/apiResponse";
import { ensureDbReady } from "../utils/dbGuard";

const dbReady = (req: Request, res: Response, next: NextFunction): void => {
    try {
        ensureDbReady();
        next();
    } catch (error) {
        handleControllerError(res, error, "dbReady");
    }
};

export default dbReady;
