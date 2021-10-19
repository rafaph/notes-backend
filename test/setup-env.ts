import faker from "faker";

process.env.NODE_ENV = "test";

process.env.JWT_SECRET = faker.random.alphaNumeric(100);

process.env.OLD_DB_DATABASE = process.env.DB_DATABASE;

process.env.DB_DATABASE = `${process.env.OLD_DB_DATABASE}_test`;
