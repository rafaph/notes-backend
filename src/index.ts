import "reflect-metadata";
import "@app/domains/di";
import "@app/application/di";
import { connectDadatabase } from "@app/domains/infra/adapters/connect-database";

(async (): Promise<void> => {
    await connectDadatabase();

    const { App } = await import("@app/application/setup/app");
    new App().listen();
})();
