import request from "supertest";
import faker from "faker";
import { createApp } from "@app/main/config/create-app";
import { Express } from "express";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";


describe("@integration SignUp Routes", () => {

    let app: Express;

    before(async () => {
        app = await createApp();
    });

    beforeEach(async () => {
        await SequelizeClient.getClient().truncate();
    });

    after(async () => {
        await SequelizeClient.getClient().close();
    });

    it("Should return an account on success", async () => {
        const route = "/api/sign-up";
        const password = faker.internet.password();

        await request(app)
            .post(route)
            .send({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password,
                passwordConfirmation: password
            })
            .expect(200);
    });
});
