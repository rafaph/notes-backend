import request from "supertest";
import faker from "faker";
import { Express } from "express";
import { TestApplication } from "@test/helper/test-application";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-account-repository";
import { Sequelize } from "sequelize";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { Argon2Adapter } from "@app/authentication/infrastructure/cryptography/argon2-adapter";


describe("@integration Login Routes", () => {
    let app: Express;
    let sequelize: Sequelize;

    before(() => {
        app = TestApplication.app;
        sequelize = SequelizeClient.getClient();
    });

    it("Should login on success", async () => {
        const route = "/api/login";
        const email = faker.internet.email();
        const password = faker.internet.password();
        const argon2 = new Argon2Adapter();
        await new SequelizeAccountRepository(sequelize).add({
            name: faker.name.firstName(),
            email,
            password: await argon2.hash(password),
        });

        await request(app)
            .post(route)
            .send({
                email,
                password,
            })
            .expect(200);
    });
});
