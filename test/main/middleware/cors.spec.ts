import request from "supertest";
import { Express, Request, Response } from "express";
import { TestApplication } from "@test/helper/test-application";


describe("@integration CORS Middleware", () => {
    let app: Express;

    before(() => {
        app = TestApplication.app;
    });

    it("Should enable CORS", async () => {
        const fakeRoute = "/test-cors";

        app.get(fakeRoute, (_: Request, response: Response) => {
            response.send();
        });

        await request(app)
            .options(fakeRoute)
            .expect("access-control-allow-origin", "*")
            .expect("access-control-allow-methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
            .expect("access-control-allow-headers", "*");
    });
});
