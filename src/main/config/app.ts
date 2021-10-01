import express from "express";
import { setupMiddlewares } from "@app/main/config/setup-middlewares";
import { setupRoutes } from "@app/main/config/setup-routes";

const app = express();

setupMiddlewares(app);
setupRoutes(app);

export { app };
