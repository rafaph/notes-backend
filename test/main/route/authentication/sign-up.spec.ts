import request from "supertest";
import faker from "faker";
import { Express } from "express";
import { TestApplication } from "@test/helper/test-application";
import { HttpStatusCodes } from "@app/utils/http-status-codes";


describe("@integration /POST /api/sign-up", () => {
    let app: Express;

    before(() => {
        app = TestApplication.app;
    });

    it("Should return a ok response with an account on success", async () => {
        const route = "/api/sign-up";
        const password = faker.internet.password();

        await request(app)
            .post(route)
            .send({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password,
                passwordConfirmation: password,
            })
            .expect(HttpStatusCodes.OK);
    });
});
