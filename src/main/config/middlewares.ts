import { Express } from "express";
import { bodyParser } from "@app/main/middlewares/body-parser";
import { cors } from "@app/main/middlewares/cors";
import { contentType } from "@app/main/middlewares/content-type";

export function setupMiddlewares(app: Express): void {
    app.use(bodyParser);
    app.use(cors);
    app.use(contentType);
}
