import request from "supertest";
import faker from "faker";
import app from "@app/main/config/app";


describe("@integration Body Parser Middleware", () => {
    it("Should parse body as json", async () => {
        const fakeRoute = "/test-body-parser";

        app.post(fakeRoute, (request, response) => {
            response.send(request.body);
        });
        const data = {
            name: faker.name.firstName(),
        };

        await request(app)
            .post(fakeRoute)
            .send(data)
            .expect(data);
    });
});
