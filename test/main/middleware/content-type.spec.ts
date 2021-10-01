import request from "supertest";
import { createApp } from "@app/main/config/create-app";
import { Express, Request, Response } from "express";


describe("@integration Content Type Middleware", () => {
    let app: Express;

    before(async () => {
        app = await createApp();
    });

    it("Should return default content type as json", async () => {
        const fakeRoute = "/test-content-type";

        app.get(fakeRoute, (_: Request, response: Response) => {
            response.send();
        });

        await request(app)
            .get(fakeRoute)
            .expect("content-type", /json/);
    });

    it("Should return xml content type when forced", async () => {
        const fakeRoute = "/test-content-type-xml";

        app.get(fakeRoute, (_: Request, response: Response) => {
            response.type("xml");
            response.send();
        });

        await request(app)
            .get(fakeRoute)
            .expect("content-type", /xml/);
    });
});
