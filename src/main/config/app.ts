import express from "express";
import { setupMiddlewares } from "@app/main/config/middlewares";

const app = express();

setupMiddlewares(app);

export default app;
