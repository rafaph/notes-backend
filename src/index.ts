import "reflect-metadata";
import "@app/domains/di";
import "@app/application/di";
import { connectDatabase } from "@app/domains/infra/adapters/connect-database";

connectDatabase().then(async () => {
    const { App } = await import("@app/application/setup/app");
    new App().listen();
});
