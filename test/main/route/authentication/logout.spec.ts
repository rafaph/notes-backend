import request from "supertest";
import faker from "faker";
import { Express } from "express";
import argon2 from "argon2";
import { Sequelize } from "sequelize";
import { TestApplication } from "@test/helper/test-application";
import { SequelizeClient } from "@app/infrastructure/shared/persistence/sequelize-client";
import { SequelizeAccountRepository } from "@app/infrastructure/authentication/persistence/sequelize/sequelize-account-repository";
import { HttpStatusCodes } from "@app/utils/http-status-codes";
import { JWTAdapter } from "@app/infrastructure/authentication/cryptography/jwt-adapter";

describe("@integration POST /api/logout", () => {
    const route = "/api/logout";
    let app: Express;
    let sequelize: Sequelize;

    before(() => {
        app = TestApplication.app;
        sequelize = SequelizeClient.getInstance();
    });

    it("Should returns a ok response on logout success", async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();
        const sequelizeRepository = new SequelizeAccountRepository(sequelize);
        const jwtAdapter = new JWTAdapter();
        const account = await sequelizeRepository.add({
            name: faker.name.firstName(),
            email,
            password: await argon2.hash(password, {
                type: argon2.argon2id,
            }),
        });
        const accessToken = await jwtAdapter.encrypt(account.id);
        await sequelizeRepository.updateAccessToken({
            id: account.id,
            accessToken,
        });

        await request(app)
            .post(route)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodes.NO_CONTENT);
    });

    it("Should returns a forbidden response on logout fails", async () => {
        const jwtAdapter = new JWTAdapter();
        const accessToken = await jwtAdapter.encrypt(faker.datatype.uuid());

        await request(app)
            .post(route)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatusCodes.FORBIDDEN);
    });
});
