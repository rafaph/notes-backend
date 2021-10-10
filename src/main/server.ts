import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { createApp } from "@app/main/config/create-app";
import { env } from "@app/main/config/env";

async function onExit(): Promise<void> {
    const sequelize = SequelizeClient.getClient();
    await sequelize.close();
}

(async (): Promise<void> => {
    const app = await createApp();

    app.listen(env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running at http://localhost:${env.PORT}`);
    });
})();

["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM"].forEach((eventType) => {
    process.on(eventType, onExit);
});
