import express, { json, NextFunction, Request, Response } from "express";
import cors from "cors";
import responseTime from "response-time";
import { SERVICE_UNAVAILABLE } from "http-status";
import { container } from "tsyringe";
import { PORT, PROD, SHUTDOWN_TIMEOUT } from "@app/domains/common/utils/environment";
import { contentType } from "@app/application/middlewares/content-type";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { Logger } from "@app/domains/common/utils/logger";
import { errorHandler } from "@app/application/middlewares/error-handler";
import { Router } from "@app/application/setup/router";

export class App {
    public app: express.Express;
    public running: boolean;

    public constructor() {
        this.app = express();
        this.running = !PROD;

        this.app.use(responseTime());
        this.app.use(this.checkServerStatus);
        this.app.use(contentType);
        this.app.use(cors({ origin: true }));
        this.app.use(json());

        const { router } = container.resolve(Router);
        this.app.use(router);

        this.app.use(errorHandler);

        ["SIGINT", "SIGTERM"].forEach((signal) => {
            process.on(signal, this.onShutdown);
        });
    }

    private onShutdown = async (): Promise<void> => {
        this.running = false;

        Logger.debug("Gracefully shutting down...");

        setTimeout(() => {
            process.exit();
        }, SHUTDOWN_TIMEOUT);
    };

    private checkServerStatus = (_req: Request, res: Response, next: NextFunction): void => {
        if (this.running) {
            next();

            return;
        }

        res.setHeader("Connection", "close");
        next(new ResponseError(SERVICE_UNAVAILABLE));
    };

    public listen(): void {
        this.app.listen(PORT, () => {
            this.running = true;

            Logger.info(`Server is running. Listening on http://localhost:${PORT}`);
            Logger.debug("Press CTRL+C to exit");
        });
    }
}
