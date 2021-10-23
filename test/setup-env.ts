import faker from "faker";
import { ConnectionString } from "connection-string";

process.env.NODE_ENV = "test";

process.env.JWT_SECRET = faker.random.alphaNumeric(100);

let database = process.env.DB_DATABASE;

if (!database) {
    const { path } = new ConnectionString(process.env.DATABASE_URL);

    if (!path) {
        throw new Error("Cant get database name");
    }

    database = path[0];
}

process.env.DB_DATABASE = `${database}_test`;
