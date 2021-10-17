import faker from "faker";

process.env.NODE_ENV = "test";

process.env.JWT_SECRET = faker.random.alphaNumeric(100);

process.env.DB_HOST = faker.internet.url();
process.env.DB_USERNAME = faker.internet.userName();
process.env.DB_PASSWORD = faker.internet.password();
process.env.DB_DATABASE = faker.random.word();
