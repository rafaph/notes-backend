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
import { makeUserWithID } from "@test/helpers/user-factories";

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

    it("should return 201 CREATED when create an user", (done) => {
        const password = faker.internet.password();
        const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            password_confirmation: password,
        };
        const bodyWithoutPasswordConfirmation = _.omit(body, ["password_confirmation"]);
        const user = makeUserWithID({
            ...bodyWithoutPasswordConfirmation,
        });
        const findOneStub = sinon.stub(Repository.prototype, "findOne").resolves(false);
        const saveStub = sinon.stub(Repository.prototype, "save").resolves(user);

        supertest(app)
            .post(route)
            .send(body)
            .expect(CREATED)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.be.deep.equal(_.pick(body, ["name", "email"]));
                expect(findOneStub).to.have.been.calledOnceWithExactly({
                    where: {
                        email: body.email,
                    },
                });
                expect(saveStub).to.have.been.calledWithMatch({
                    ..._.omit(bodyWithoutPasswordConfirmation, ["password"]),
                    access_token: null,
                });

                doc.path(route)
                    .verb("post", {
                        tags: ["user"],
                        requestBody: {
                            content: body,
                            mediaType: "application/json",
                        },
                    })
                    .fromSuperAgentResponse(res, "Created the user with success");

                done();
            });
    });
});
