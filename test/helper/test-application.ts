import { Express } from "express";
import { TestDatabase } from "@test/helper/test-database";
import { createApp } from "@app/main/config/create-app";

export class TestApplication {
    private static application?: Express;
    private static testDatabase = new TestDatabase();

    public static async setup(): Promise<void> {
        await this.testDatabase.setup();
        this.application = await createApp();
    }

    public static async tearDown(): Promise<void> {
        await this.testDatabase.tearDown();
    }

    public static get app(): Express {
        return this.application as Express;
    }

    public static async truncateDatabase(): Promise<void> {
        return this.testDatabase.truncate();
    }
}
