import type { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status";
import { Logger } from "@app/domains/common/utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    Logger.error(`Request to ${req.method} ${req.path} responded with an error`, error);

    if (error.name === "ResponseError") {
        res.status(error.status).json({ message: error.message, code: error.code });
    } else if (error.name === "UnauthorizedError") {
        res.status(UNAUTHORIZED).json({ message: error.inner?.message || error.message, code: error.code });
    } else {
        res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
