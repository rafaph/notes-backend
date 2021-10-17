import { Router as ExpressRouter, RequestHandler } from 'express';
import { container, injectable, Lifecycle, scoped, injectAll } from 'tsyringe';
import { NOT_FOUND } from 'http-status';
import Controller from "@app/domains/common/interfaces/controller";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { Logger } from "@app/domains/common/utils/logger";

@scoped(Lifecycle.ResolutionScoped)
@injectable()
class Router {
    public readonly router: ExpressRouter;

    public constructor(@injectAll('Controller') private readonly controllers: Controller<unknown, unknown>[]) {
        this.router = ExpressRouter();

        this.controllers.forEach((controller) => {
            Logger.debug(`Route ${controller.verb.toUpperCase()} ${controller.path} created`);
            this.router[controller.verb](controller.path, ...this.getHandlers(controller));
        });

        this.router.use('*', (req) => {
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

export const router = container.resolve(Router).router;
