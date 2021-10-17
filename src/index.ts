import 'reflect-metadata';
import "@app/application/di";

(async (): Promise<void> => {
    const { App } = await import ("@app/application/setup/app");
    new App().listen();
})();
