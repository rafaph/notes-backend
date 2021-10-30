import { Express } from "express";
import faker from "faker";
import { CREATED } from "http-status";
import supertest from "supertest";
import { container } from "tsyringe";
import { App } from "@app/application/setup/app";
import { AuthenticationService } from "@app/domains/user/services/authentication-service";
import { UserService } from "@app/domains/user/services/user-service";
import { UserData } from "@app/domains/user/types/user";
import * as dbHelpers from "@test/helpers/database";
import { doc } from "@test/helpers/documentation";
import { makeCreateUserPayload } from "@test/helpers/user-factories";

const route = "/api/v1/category/create";

describe(`POST ${route} @integration`, () => {
    let app: Express;
    let userData: UserData;
    let accessToken: string;

    before(() => {
        app = new App().app;
    });

    beforeEach(async () => {
        await dbHelpers.beforeEachTest();

        const userService = container.resolve<UserService>("UserService");
        const authenticationService = container.resolve<AuthenticationService>("AuthenticationService");
        const createUserPayload = makeCreateUserPayload();
        userData = await userService.create(createUserPayload);
        accessToken = await authenticationService.authenticate(userData.email, createUserPayload.password);
    });

    afterEach(async () => {
        await dbHelpers.afterEachTest();
    });

    after(async () => {
        await doc.writeFile();
    });

    it("should create an user", async () => {
        const body = {
            name: faker.name.firstName(),
        };
        const response = await supertest(app).post(route).set("x-access-token", accessToken).send(body).expect(CREATED);

        doc.path(route)
            .verb("post", {
                tags: ["category"],
                requestBody: {
                    content: body,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "When creates a category");
    });
});
