import { expect } from "chai";
import { Express } from "express";
import faker from "faker";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status";
import supertest from "supertest";
import { container } from "tsyringe";
import { App } from "@app/application/setup/app";
import { UserService } from "@app/domains/user/services/user-service";
import * as dbHelpers from "@test/helpers/database";
import { doc } from "@test/helpers/documentation";
import { makeCreateUserPayload } from "@test/helpers/user-factories";

const route = "/api/v1/login";

describe(`POST ${route} @integration`, () => {
    let app: Express;

    before(() => {
        app = new App().app;
    });

    beforeEach(async () => {
        await dbHelpers.beforeEachTest();
    });

    afterEach(async () => {
        await dbHelpers.afterEachTest();
    });

    after(async () => {
        await doc.writeFile();
    });

    it("should return 200 OK when login an user", async () => {
        const userService = container.resolve<UserService>("UserService");
        const userPayload = makeCreateUserPayload();
        const userData = await userService.create(userPayload);
        const requestBody = {
            email: userData.email,
            password: userPayload.password,
        };

        const response = await supertest(app).post(route).send(requestBody).expect(OK);

        expect(response.body).to.have.property("access_token");

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: requestBody,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "When user logged in successfully");
    });

    it("should return 400 BAD_REQUEST when missing data", async () => {
        const requestBody = {
            email: faker.internet.email(),
        };

        const response = await supertest(app).post(route).send(requestBody).expect(BAD_REQUEST);

        expect(response.body).to.have.property("message");

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: requestBody,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "When missing data when logging in");
    });

    it("should return 401 UNAUTHORIZED when user is not found by email", async () => {
        const requestBody = {
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        const response = await supertest(app).post(route).send(requestBody).expect(UNAUTHORIZED);

        expect(response.body).to.have.property("message");

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: requestBody,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "When user is not found by email");
    });

    it("should return 401 UNAUTHORIZED when user is found by email but password is wrong", async () => {
        const userService = container.resolve<UserService>("UserService");
        const userPayload = makeCreateUserPayload();
        const userData = await userService.create(userPayload);
        const requestBody = {
            email: userData.email,
            password: faker.internet.password(),
        };

        const response = await supertest(app).post(route).send(requestBody).expect(UNAUTHORIZED);

        expect(response.body).to.have.property("message");

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: requestBody,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "When user is found by email but password is wrong");
    });
});
