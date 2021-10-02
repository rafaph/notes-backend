import { NextFunction, Request, Response } from "express";

export function contentType(_request: Request, response: Response, next: NextFunction): void {
    response.type("json");
    next();
}
