import { NextFunction, Request, Response } from "express";
import CustomError from "../../../framework/services/errorInstance";

const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof CustomError) {
        res.status(error.statusCode as number).json({ error: error.message });
    } else {
        res.status(500).json({ error: error.message });
    }
};
export default errorHandler;
