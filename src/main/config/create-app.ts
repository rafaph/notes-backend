import express, { Express } from "express";
import { setupMiddlewares } from "@app/main/config/setup-middlewares";
import { setupRoutes } from "@app/main/config/setup-routes";


export async function createApp(): Promise<Express> {
    const app = express();

    await setupMiddlewares(app);
    await setupRoutes(app);

    return app;
}
