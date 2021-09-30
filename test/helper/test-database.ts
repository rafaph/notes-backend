import { Client } from "pg";
import { Sequelize } from "sequelize";
import Umzug, { Umzug as UmzugType } from "umzug";
import { v4 } from "uuid";
import { parse } from "pg-connection-string";
import path from "path";

export class TestDatabase {
    public readonly databaseName: string;
    private readonly umzug: UmzugType;
    public readonly sequelize: Sequelize;
    private readonly client: Client;

    public constructor() {
        const connectionString = process.env.DATABASE_URL as string;
        const { host, port, user, password, database } = parse(connectionString);
        this.databaseName = `${database}_${v4().replace(/-/g, "_")}`;
        this.sequelize = new Sequelize(this.databaseName, user as string, password, {
            host: host as string,
            port: parseInt((port as string), 10),
            dialect: "postgres",
            logging: false,
        });

        this.client = new Client({ connectionString });
        this.umzug = new Umzug({
            storage: "sequelize",
            storageOptions: {
                sequelize: this.sequelize,
            },
            migrations: {
                params: [
                    this.sequelize.getQueryInterface(),
                ],
                path: path.join(__dirname, "../../migrations"),
                pattern: /\.ts$/,
            },
        });
    }

    public async setUp(): Promise<void> {
        await this.client.connect();
        await this.client.query(`CREATE DATABASE ${this.databaseName};`);
        await this.umzug.up();
    }

    public async cleanUp(): Promise<void> {
        await this.sequelize.close();
        await this.client.query(`DROP DATABASE ${this.databaseName};`);
        await this.client.end();
    }

    public async run(operation: (sequelize: Sequelize) => Promise<void>): Promise<void> {
        try {
            await this.setUp();
            await operation(this.sequelize);
        } finally {
            await this.cleanUp();
        }
    }
}
