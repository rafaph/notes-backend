import { Request, Response } from "express";
import { Controller } from "@app/presentation/shared/protocol/controller";
import { HttpRequest } from "@app/presentation/shared/protocol/http";

export class ExpressRouteAdapter {
    public static adapt(controller: Controller) {
        return async (request: Request, response: Response): Promise<void> => {
            const httpRequest: HttpRequest = {
                body: request.body,
            };

            const httpResponse = await controller.handle(httpRequest);

            if (httpResponse.statusCode > 199 && httpResponse.statusCode < 300) {
                response.status(httpResponse.statusCode).json(httpResponse.body);
            } else {
                response.status(httpResponse.statusCode).json({
                    error: (httpResponse.body as Error).message,
                });
            }
        };
    }
}
