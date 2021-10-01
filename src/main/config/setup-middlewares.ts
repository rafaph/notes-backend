import { Express } from "express";
import { bodyParser } from "@app/main/middleware/body-parser";
import { cors } from "@app/main/middleware/cors";
import { contentType } from "@app/main/middleware/content-type";

export async function setupMiddlewares(app: Express): Promise<void> {
    app.use(bodyParser);
    app.use(cors);
    app.use(contentType);
}
