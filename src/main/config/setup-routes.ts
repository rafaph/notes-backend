import fs from "fs";
import path from "path";
import { Express, Router } from "express";

const files = fs
    .readdirSync(path.join(__dirname, "..", "route"))
    .filter(file => !file.includes(".d.ts"));

export async function setupRoutes(app: Express): Promise<void> {
    const router = Router();

    for (const file of files) {
        const { route } = await import(`../route/${file}`);
        route(router);
    }

    app.use("/api", router);
}
