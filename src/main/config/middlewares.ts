import { Express } from "express";
import { bodyParser } from "@app/main/middlewares/body-parser";
import { cors } from "@app/main/middlewares/cors";

export function setupMiddlewares(app: Express): void {
    app.use(bodyParser);
    app.use(cors);
}
