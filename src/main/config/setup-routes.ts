import { Express, Router } from "express";
import glob from "glob";

export function setupRoutes(app: Express): void {
    const router = Router();
    app.use("/api", router);

    glob.sync("**/src/main/route/*.ts").map(file => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { route } = require(`@app${file.slice(3)}`);
        route(router);
    });
}
