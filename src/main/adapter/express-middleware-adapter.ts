import { NextFunction, Request, Response } from "express";
import { Middleware } from "@app/presentation/shared/protocol/middleware";
import { HttpRequest } from "@app/presentation/shared/protocol/http";

export class ExpressMiddlewareAdapter {
    public static adapt(middleware: Middleware) {
        return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
            const httpRequest: HttpRequest = {
                headers: request.headers,
            };

            const httpResponse = await middleware.handle(httpRequest);

            if (httpResponse.statusCode > 199 && httpResponse.statusCode < 300) {
                if (httpResponse.body) {
                    Object.assign(request, { data: httpResponse.body });
                }
                next();
            } else {
                response.status(httpResponse.statusCode).json({
                    error: (httpResponse.body as Error).message,
                });
            }
        };
    }
}
