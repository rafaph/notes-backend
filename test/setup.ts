import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import chaiDateTime from "chai-datetime";
import { ConnectionString } from "connection-string";
import faker from "faker";
import { Sequelize } from "sequelize";
import { Client } from "pg";
import Umzug from "umzug";
import path from "path";
import { env } from "@app/main/config/env";

chai.config.truncateThreshold = 1;
chai.config.showDiff = true;

chai.use(chaiAsPromise);
chai.use(chaiDateTime);

// TODO: improve me!!

let oldConnectionString: string;
let connectionString: string;
let databaseName: string;

function generateTestConnectionString(): string {
    const connection = new ConnectionString(process.env.DATABASE_URL);
    const [database] = connection.path as string[];

    databaseName = `${database}-${faker.datatype.uuid()}`.replace(/-/g, "_");
    connection.path = [databaseName];

    return connection.toString();
}

export async function mochaGlobalSetup(): Promise<void> {
    oldConnectionString = env.DATABASE_URL;
    connectionString = generateTestConnectionString();

    const sequelize = new Sequelize(connectionString, { logging: false });
    const pgClient = new Client({ connectionString: oldConnectionString });
    const umzug = new Umzug({
        storage: "sequelize",
        storageOptions: {
            sequelize,
        },
        migrations: {
            params: [
                sequelize.getQueryInterface(),
            ],
            path: path.join(__dirname, "../migrations"),
            pattern: /\.ts$/,
        },
    });

    await pgClient.connect();
    await pgClient.query(`CREATE DATABASE ${databaseName};`);
    await pgClient.end();
    await umzug.up();
    await sequelize.close();

    env.DATABASE_URL = connectionString;
    process.env.DATABASE_URL = env.DATABASE_URL;
}

export async function mochaGlobalTeardown(): Promise<void> {
    const pgClient = new Client({ connectionString: oldConnectionString });
    await pgClient.connect();
    await pgClient.query(`DROP DATABASE ${databaseName};`);
    await pgClient.end();
}
