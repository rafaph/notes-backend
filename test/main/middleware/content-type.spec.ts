import request from "supertest";
import { app } from "@app/main/config/app";
import { Request, Response } from "express";


describe("@integration Content Type Middleware", () => {
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
