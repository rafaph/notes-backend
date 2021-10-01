import { ChildProcess, spawn } from "child_process";
import getPort from "get-port";
import request from "supertest";
import { retry } from "async";
import { TestDatabase } from "@test/helper/test-database";
import { HttpStatusCodes } from "@app/shared/utils/http-status-codes";
import { env } from "@app/main/config/env";

const HEALTH_CHECK_TIMEOUT = 10;

export class TestApplication {
    private readonly testDatabase: TestDatabase;
    private serverProcess?: ChildProcess;
    private httpPort?: string;

    public constructor() {
        this.testDatabase = new TestDatabase();
    }

    public async setUp(): Promise<void> {
        await this.testDatabase.setUp();

        this.httpPort = (await getPort()).toString(10);

        const currentEnv = {
            ...process.env,
            ...env,
            PORT: this.httpPort,
            DATABASE_URL: this.testDatabase.connectionString,
        };
        this.serverProcess = spawn(
            "npm",
            ["start"],
            {
                env: currentEnv,
                cwd: env.BASE_DIR,
                killSignal: "SIGTERM",
                stdio: "ignore",
            },
        );

        await this.waitHealthCheck();
    }

    public async cleanUp(): Promise<void> {
        this.serverProcess?.kill("SIGTERM");
        await this.testDatabase.cleanUp();

    }

    private async waitHealthCheck(): Promise<void> {
        await retry({
            interval: HEALTH_CHECK_TIMEOUT,
            times: 10000,
        }, async () => {
            await request(this.baseUrl)
                .get("/api/health-check")
                .expect(HttpStatusCodes.OK);
        });
    }

    public async truncateDatabase(): Promise<void> {
        return this.testDatabase.truncate();
    }

    public get baseUrl(): string {
        return `http://localhost:${this.httpPort}`;
    }
}
