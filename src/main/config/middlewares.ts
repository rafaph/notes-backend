import { Express } from "express";
import { bodyParser } from "@app/main/middlewares/body-parser";

export function setupMiddlewares(app: Express): void {
    app.use(bodyParser);
}
