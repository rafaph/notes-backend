import supertest from "supertest";
import { Express } from "express";
import { FORBIDDEN, NO_CONTENT } from "http-status";
import { doc } from "@test/helpers/documentation";
import * as dbHelpers from "@test/helpers/database";
import { App } from "@app/application/setup/app";
import { container } from "tsyringe";
import { UserService } from "@app/domains/user/services/user-service";
import { makeCreateUserPayload } from "@test/helpers/user-factories";
import { AuthenticationService } from "@app/domains/user/services/authentication-service";
import faker from "faker";
import { Repository } from "typeorm";
import { User } from "@app/domains/user/core/entities/user";

const route = "/api/v1/logout";

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

    it("should logout an user", async () => {
        const userService = container.resolve<UserService>("UserService");
        const authenticationService = container.resolve<AuthenticationService>("AuthenticationService");
        const createUserPayload = makeCreateUserPayload();
        const userData = await userService.create(createUserPayload);
        const accessToken = await authenticationService.authenticate(userData.email, createUserPayload.password);

        const response = await supertest(app).post(route).set("x-access-token", accessToken).expect(NO_CONTENT);

        doc.path(route)
            .verb("post", {
                tags: ["user"],
            })
            .fromSuperAgentResponse(response, "When x-access-token is valid in headers");
    });

    it("should return 400 FORBIDDEN when is not logged in", async () => {
        const response = await supertest(app).post(route).expect(FORBIDDEN);

        doc.path(route)
            .verb("post", {
                tags: ["user"],
            })
            .fromSuperAgentResponse(response, "When x-access-token is not provided in headers");
    });

    it("should return 400 FORBIDDEN when token is invalid", async () => {
        const accessToken = faker.datatype.uuid();

        const response = await supertest(app).post(route).set("x-access-token", accessToken).expect(FORBIDDEN);

        doc.path(route)
            .verb("post", {
                tags: ["user"],
            })
            .fromSuperAgentResponse(response, "When x-access-token is invalid in headers");
    });

    it("should return 400 FORBIDDEN when token content is invalid", async () => {
        const userService = container.resolve<UserService>("UserService");
        const authenticationService = container.resolve<AuthenticationService>("AuthenticationService");
        const createUserPayload = makeCreateUserPayload();
        const userData = await userService.create(createUserPayload);
        const accessToken = await authenticationService.authenticate(userData.email, createUserPayload.password);

        const userDAO = container.resolve<Repository<User>>("UserDAO");
        await userDAO.delete({
            id: userData.id,
        });

        const response = await supertest(app).post(route).set("x-access-token", accessToken).expect(FORBIDDEN);

        doc.path(route)
            .verb("post", {
                tags: ["user"],
            })
            .fromSuperAgentResponse(response, "When x-access-token content is invalid in headers");
    });
});
