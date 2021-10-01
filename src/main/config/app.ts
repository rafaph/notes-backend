import express from "express";
import { setupMiddlewares } from "@app/main/config/setup-middlewares";

const app = express();

setupMiddlewares(app);

export default app;
