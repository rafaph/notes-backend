import { createApp } from "@app/main/config/create-app";
import { env } from "@app/main/config/env";

(async (): Promise<void> => {
    const app = await createApp();

    app.listen(env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running at http://localhost:${env.PORT}`);
    });
})();
