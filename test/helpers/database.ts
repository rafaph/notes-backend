import { Client } from "pg";
import { container } from "tsyringe";
import { Connection } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { DB } from "@app/domains/common/utils/environment";
import { connectDatabase } from "@app/domains/infra/adapters/connect-database";

let transactionalContext: TransactionalTestContext;

async function query(command: string): Promise<void> {
    const pgClient = new Client({
        host: DB.HOST,
        port: DB.PORT,
        user: DB.USERNAME,
        password: DB.PASSWORD,
        database: process.env.OLD_DB_DATABASE,
    });
    await pgClient.connect();
    await pgClient.query(command);
    await pgClient.end();
}

async function dropTestDatabase(): Promise<void> {
    await query(`DROP DATABASE IF EXISTS ${DB.DATABASE};`);
}

export async function beforeTests(): Promise<void> {
    await dropTestDatabase();
    await query(`CREATE DATABASE ${DB.DATABASE};`);
    if (!container.isRegistered("DbConnection")) {
        await connectDatabase();
    }
    let connection = container.resolve<Connection>("DbConnection");
    if (!connection.isConnected) {
        connection = await connection.connect();
        container.registerInstance("DbConnection", connection);
    }
    await connection.runMigrations();
}

export async function beforeEachTest(): Promise<void> {
    transactionalContext = new TransactionalTestContext(container.resolve<Connection>("DbConnection"));
    await transactionalContext.start();
}

export async function afterEachTest(): Promise<void> {
    await transactionalContext.finish();
}

export async function afterTests(): Promise<void> {
    const connection = container.resolve<Connection>("DbConnection");
    await connection.close();
    await dropTestDatabase();
}
