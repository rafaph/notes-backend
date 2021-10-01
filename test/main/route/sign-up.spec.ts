import request from "supertest";
import { app } from "@app/main/config/app";
import faker from "faker";


describe("@integration SignUp Routes", () => {
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
