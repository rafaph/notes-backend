import { Client } from "pg";
import { container } from "tsyringe";
import { Connection } from "typeorm";
import { DB } from "@app/domains/common/utils/environment";
import { connectDatabase } from "@app/domains/infra/adapters/connect-database";

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

export async function createDatabase(): Promise<void> {
    await query(`DROP DATABASE IF EXISTS ${DB.DATABASE};`);
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

export async function clearTables(): Promise<void> {
    const queryRunner = container.resolve<Connection>("DbConnection").createQueryRunner();
    await queryRunner.clearTable("users");
}

export async function dropDatabase(): Promise<void> {
    const connection = container.resolve<Connection>("DbConnection");
    await connection.close();
    await query(`DROP DATABASE ${DB.DATABASE};`);
}
