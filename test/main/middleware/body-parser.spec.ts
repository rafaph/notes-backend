import { Express, Request, Response } from "express";
import request from "supertest";
import faker from "faker";
import { createApp } from "@app/main/config/create-app";


describe("@integration Body Parser Middleware", () => {
    let app: Express;

    before(async () => {
        app = await createApp();
    });

    it("Should parse body as json", async () => {
        const fakeRoute = "/test-body-parser";

        app.post(fakeRoute, (request: Request, response: Response): void => {
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
