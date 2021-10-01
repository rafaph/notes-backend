import { Express, Router } from "express";
import glob from "glob";

const files = glob.sync("**/src/main/route/*.ts");

export async function setupRoutes(app: Express): Promise<void> {
    const router = Router();

    for (const file of files) {
        const { route } = await import(`@app${file.slice(3)}`);

        route(router);
    }

    app.use("/api", router);
}
