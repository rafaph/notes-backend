import _ from "lodash";
import sinon from "sinon";
import { Express } from "express";
import supertest from "supertest";
import { CREATED } from "http-status";
import { Repository } from "typeorm";
import faker from "faker";
import { expect } from "chai";
import { App } from "@app/application/setup/app";
import { doc } from "@test/helpers/documentation";
import { makeUserData } from "@test/helpers/user-factories";
import { container } from "tsyringe";
import { Hashing } from "@app/domains/infra/adapters/hashing";

const route = "/api/v1/sign-up";

describe(`POST ${route} @integration`, () => {
    let app: Express;

    before(() => {
        app = new App().app;
    });

    afterEach(() => {
        sinon.restore();
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
        const bodyWithoutPasswordConfirmation = _.omit(body, ["password_confirmation"]);
        const hashing = container.resolve<Hashing>("Hashing");
        const userData = makeUserData({
            ...bodyWithoutPasswordConfirmation,
            password: await hashing.hash(password),
        });

        const findOneStub = sinon.stub(Repository.prototype, "findOne");
        const firstFindOneStub = findOneStub.onFirstCall().resolves(false);
        const saveStub = sinon.stub(Repository.prototype, "save").onFirstCall().resolves(userData);

        const secondFindOneStub = findOneStub.onSecondCall().resolves(userData);
        const updateStub = sinon.stub(Repository.prototype, "update").resolves();

        const response = await supertest(app).post(route).send(body).expect(CREATED);

        expect(response.body).to.have.all.keys("access_token");

        expect(firstFindOneStub).to.have.been.calledWithExactly({
            where: {
                email: body.email,
            },
            select: ["id"],
        });

        expect(saveStub).to.have.been.calledWithMatch(_.omit(bodyWithoutPasswordConfirmation, ["password"]));

        expect(secondFindOneStub).to.have.been.calledWithExactly({
            where: {
                email: body.email,
            },
            select: ["id", "password"],
        });

        expect(updateStub).to.have.been.calledOnceWithExactly(
            {
                id: userData.id,
            },
            {
                access_token: response.body.access_token,
            },
        );

        doc.path(route)
            .verb("post", {
                tags: ["user"],
                requestBody: {
                    content: body,
                    mediaType: "application/json",
                },
            })
            .fromSuperAgentResponse(response, "Created the user with success");
    });
});
