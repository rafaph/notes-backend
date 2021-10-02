import request from "supertest";
import faker from "faker";
import { Express } from "express";
import { TestApplication } from "@test/helper/test-application";


describe("@integration SignUp Routes", () => {
    let app: Express;

    before(() => {
        app = TestApplication.app;
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
                passwordConfirmation: password,
            })
            .expect(200);
    });
});
