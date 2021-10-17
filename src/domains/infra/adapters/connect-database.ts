import path from "path";
import { container } from "tsyringe";
import { Connection, createConnection } from "typeorm";
import { DB } from "@app/domains/common/utils/environment";
import { Logger } from "@app/domains/common/utils/logger";

let connection: Connection;

const pgConnect = async (): Promise<Connection> => {
    if (!connection) {
        connection = await createConnection({
            type: "postgres",
            host: DB.HOST,
            port: DB.PORT,
            username: DB.USERNAME,
            password: DB.PASSWORD,
            database: DB.DATABASE,
            entities: [path.resolve(__dirname, "../../user/core/entities/*.{ts,js}")],
        });
    }

    return connection;
};

export const connectDadatabase = (): Promise<void> =>
    pgConnect()
        .then((conn) => {
            Logger.debug("Database connection created with success.");

            container.registerInstance("DbConnection", conn);
        })
        .catch((error) => {
            Logger.error("Failed to connect to the database.", error);

            process.exit(1);
        });
