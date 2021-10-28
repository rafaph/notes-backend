import { expect } from "chai";
import { Express } from "express";
import faker from "faker";
import { BAD_REQUEST, CREATED, FORBIDDEN } from "http-status";
import supertest from "supertest";
import { container } from "tsyringe";
import { Repository } from "typeorm";
import { App } from "@app/application/setup/app";
import { User } from "@app/domains/user/core/entities/user";
import * as dbHelpers from "@test/helpers/database";
import { doc } from "@test/helpers/documentation";

const route = "/api/v1/sign-up";

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

    it("should return 201 CREATED when create an user", async () => {
        const password = faker.internet.password();
        const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            password_confirmation: password,
        };

        const response = await supertest(app).post(route).send(body).expect(CREATED);
        expect(response.body).to.have.property("access_token");

        const userDAO = container.resolve<Repository<User>>("UserDAO");
        await userDAO.findOneOrFail({
            where: { email: body.email },
        });

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: body,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "When user is created successfully");
    });

    it("should return 400 BAD REQUEST if missing data", async () => {
        const password = faker.internet.password();
        const body = {
            email: faker.internet.email(),
            password,
            password_confirmation: password,
        };

        const response = await supertest(app).post(route).send(body).expect(BAD_REQUEST);

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: body,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(
                response,
                "When missing user data or password and password_confirmation are different",
            );
    });

    it("should return 403 FORBIDDEN if email already taken", async () => {
        const password = faker.internet.password();
        const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            password_confirmation: password,
        };

        const userDAO = container.resolve<Repository<User>>("UserDAO");
        await userDAO.save({
            name: faker.name.firstName(),
            email: body.email,
            password: faker.internet.password(),
        });

        const response = await supertest(app).post(route).send(body).expect(FORBIDDEN);

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: body,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "When email is already taken");
    });
});
