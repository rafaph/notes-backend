import { expect } from "chai";
import supertest from "supertest";
import { Express } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status";
import { container } from "tsyringe";
import { doc } from "@test/helpers/documentation";
import { clearTables, createDatabase, dropDatabase } from "@test/helpers/database";
import { App } from "@app/application/setup/app";
import { UserService } from "@app/domains/user/services/user-service";
import { makeCreateUserPayload } from "@test/helpers/user-factories";
import faker from "faker";

const route = "/api/v1/login";

describe(`POST ${route} @integration`, () => {
    let app: Express;

    before(async () => {
        await createDatabase();
        app = new App().app;
    });

    beforeEach(async () => {
        await clearTables();
    });

    after(async () => {
        await dropDatabase();
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
