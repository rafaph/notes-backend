import request from "supertest";
import faker from "faker";
import { Express } from "express";
import argon2 from "argon2";
import { Sequelize } from "sequelize";
import { TestApplication } from "@test/helper/test-application";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/account/sequelize-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { HttpStatusCodes } from "@app/shared/utils/http-status-codes";

describe("@integration POST /api/login", () => {
    const route = "/api/login";
    let app: Express;
    let sequelize: Sequelize;

    before(() => {
        app = TestApplication.app;
        sequelize = SequelizeClient.getClient();
    });

    it("Should returns a ok response on login success", async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();
        await new SequelizeAccountRepository(sequelize).add({
            name: faker.name.firstName(),
            email,
            password: await argon2.hash(password, {
                type: argon2.argon2id,
            }),
        });

        await request(app)
            .post(route)
            .send({ email, password })
            .expect(HttpStatusCodes.OK);
    });

    it("Should returns a unauthorized response on login fails", async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        await request(app)
            .post(route)
            .send({ email, password })
            .expect(HttpStatusCodes.UNAUTHORIZED);
    });
});
