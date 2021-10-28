import { RequestHandler, Router as ExpressRouter } from "express";
import { NOT_FOUND } from "http-status";
import { injectable, injectAll, Lifecycle, scoped } from "tsyringe";
import { Controller } from "@app/domains/common/interfaces/controller";
import { Logger } from "@app/domains/common/utils/logger";
import { ResponseError } from "@app/domains/common/utils/response-error";

@scoped(Lifecycle.ResolutionScoped)
@injectable()
export class Router {
    public readonly router: ExpressRouter;

    public constructor(@injectAll("Controller") private readonly controllers: Controller<unknown, unknown>[]) {
        this.router = ExpressRouter();

        this.controllers.forEach((controller) => {
            Logger.debug(`Route ${controller.verb.toUpperCase()} ${controller.path} created`);
            this.router[controller.verb](controller.path, ...this.getHandlers(controller));
        });

        this.router.use("*", (req) => {
            throw new ResponseError(NOT_FOUND, `Cannot ${req.method} ${req.path}`);
        });
    }

    private getHandlers(controller: Controller<unknown, unknown>): RequestHandler[] {
        const handler: RequestHandler = async (req, res, next) => {
            try {
                await controller.handle(req, res);
            } catch (error) {
                next(error);
            }
        };

        return [...controller.middlewares, handler];
    }
}
