import { Controller } from "@app/shared/presentation/protocol/controller";
import { Request, Response } from "express";
import { HttpRequest } from "@app/shared/presentation/protocol/http";

export class ExpressRouteAdapter {
    public static adapt(controller: Controller) {
        return async (request: Request, response: Response): Promise<void> => {
            const httpRequest: HttpRequest = {
                body: request.body,
            };

            const httpResponse = await controller.handle(httpRequest);

            if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
                response.status(httpResponse.statusCode).json(httpResponse.body);
            } else {
                response.status(httpResponse.statusCode).json({
                    error: (httpResponse.body as Error).message,
                });
            }
        };
    }
}
