import cors from "cors";
import express, { json, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { SERVICE_UNAVAILABLE } from "http-status";
import morgan from "morgan";
import responseTime from "response-time";
import swaggerUi from "swagger-ui-express";
import { container } from "tsyringe";
import YAML from "yamljs";
import { contentType } from "@app/application/middlewares/content-type";
import { errorHandler } from "@app/application/middlewares/error-handler";
import { Router } from "@app/application/setup/router";
import { ENV, PORT, PROD, SHUTDOWN_TIMEOUT } from "@app/domains/common/utils/environment";
import { Logger } from "@app/domains/common/utils/logger";
import { ResponseError } from "@app/domains/common/utils/response-error";

export class App {
    public app: express.Express;
    public running: boolean;

    public constructor() {
        this.app = express();
        this.running = !PROD;

        if (ENV !== "test" && !PROD) {
            this.app.use(morgan("dev"));
            const swaggerDocument = YAML.load("doc/api-reference.yml");
            this.app.use("/api-docs", swaggerUi.serve);
            this.app.get("/api-docs", swaggerUi.setup(swaggerDocument));
        }

        this.app.use(helmet());
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
