import { expect } from "chai";
import faker from "faker";
import { UNAUTHORIZED } from "http-status";
import sinon from "sinon";
import { AuthenticationService } from "@app/domains/user/services/authentication-service";
import { makeAuthenticationService } from "@test/helpers/user-factories";

describe("AuthenticationService @unit", () => {
    describe("Sanity tests", () => {
        it("should exists", () => {
            expect(AuthenticationService).to.be.not.null;
            expect(AuthenticationService).to.be.not.undefined;
        });

        it("should be a class", () => {
            expect(makeAuthenticationService()).to.be.instanceOf(AuthenticationService);
        });

        it("should implements IAuthenticationService", () => {
            const instance = makeAuthenticationService();
            expect(instance.authenticate).to.be.instanceOf(Function);
        });
    });

    describe("Unit tests", () => {
        context("authenticate method", () => {
            it("should authenticate an user", async () => {
                const email = faker.internet.email();
                const id = faker.datatype.uuid();
                const password = faker.internet.password();
                const findByEmailStub = sinon.stub().resolves({ id, password });
                const verifyStub = sinon.stub().resolves(true);
                const expectedAccessToken = faker.lorem.word();
                const signStub = sinon.stub().resolves(expectedAccessToken);
                const updateAccessTokenStub = sinon.stub();

                const sut = makeAuthenticationService(
                    {
                        findByEmail: findByEmailStub,
                        updateAccessToken: updateAccessTokenStub,
                    },
                    {
                        verify: verifyStub,
                    },
                    {
                        sign: signStub,
                    },
                );

                const accessToken = await sut.authenticate(email, password);

                expect(accessToken).to.be.equals(expectedAccessToken);
                expect(findByEmailStub).to.have.been.calledOnceWithExactly(email, ["id", "password"]);
                expect(verifyStub).to.have.been.calledOnceWithExactly(password, password);
                expect(signStub).to.have.been.calledOnceWithExactly(id);
                expect(updateAccessTokenStub).to.have.been.calledOnceWithExactly(id, expectedAccessToken);
            });

            it("should throw a ResponseError if userRepository.findByEmail fails to return an user", async () => {
                const findByEmailStub = sinon.stub().resolves(false);
                const email = faker.internet.email();

                const sut = makeAuthenticationService({ findByEmail: findByEmailStub });

                await expect(
                    sut.authenticate(email, faker.internet.password()),
                ).to.eventually.be.rejected.with.property("status", UNAUTHORIZED);
                expect(findByEmailStub).to.have.been.calledOnceWithExactly(email, ["id", "password"]);
            });

            it("should throw if userRepository.findByEmail throws", async () => {
                const findByEmailStub = sinon.stub().rejects();
                const email = faker.internet.email();

                const sut = makeAuthenticationService({ findByEmail: findByEmailStub });

                await expect(sut.authenticate(email, faker.internet.password())).to.eventually.be.rejected;
                expect(findByEmailStub).to.have.been.calledOnceWithExactly(email, ["id", "password"]);
            });

            it("should throw a ResponseError if hashing.verify returns false", async () => {
                const email = faker.internet.email();
                const password = faker.internet.password();
                const findByEmailStub = sinon.stub().resolves({ password });
                const verifyStub = sinon.stub().resolves(false);

                const sut = makeAuthenticationService(
                    {
                        findByEmail: findByEmailStub,
                    },
                    {
                        verify: verifyStub,
                    },
                );

                await expect(sut.authenticate(email, password)).to.eventually.be.rejected.with.property(
                    "status",
                    UNAUTHORIZED,
                );
                expect(findByEmailStub).to.have.been.calledOnceWithExactly(email, ["id", "password"]);
                expect(verifyStub).to.have.been.calledOnceWithExactly(password, password);
            });

            it("should throw if hashing.verify throws", async () => {
                const email = faker.internet.email();
                const password = faker.internet.password();
                const findByEmailStub = sinon.stub().resolves({ password });
                const verifyStub = sinon.stub().rejects();

                const sut = makeAuthenticationService(
                    {
                        findByEmail: findByEmailStub,
                    },
                    {
                        verify: verifyStub,
                    },
                );

                await expect(sut.authenticate(email, password)).to.eventually.be.rejected;
                expect(findByEmailStub).to.have.been.calledOnceWithExactly(email, ["id", "password"]);
                expect(verifyStub).to.have.been.calledOnceWithExactly(password, password);
            });

            it("should throw if tokenManager.sign throws", async () => {
                const id = faker.datatype.uuid();
                const email = faker.internet.email();
                const password = faker.internet.password();
                const findByEmailStub = sinon.stub().resolves({ id, password });
                const verifyStub = sinon.stub().resolves(true);
                const signStub = sinon.stub().rejects();

                const sut = makeAuthenticationService(
                    {
                        findByEmail: findByEmailStub,
                    },
                    {
                        verify: verifyStub,
                    },
                    {
                        sign: signStub,
                    },
                );

                await expect(sut.authenticate(email, password)).to.eventually.be.rejected;
                expect(findByEmailStub).to.have.been.calledOnceWithExactly(email, ["id", "password"]);
                expect(verifyStub).to.have.been.calledOnceWithExactly(password, password);
                expect(signStub).to.have.been.calledOnceWithExactly(id);
            });

            it("should throw if userRepository.updateAccessToken throws", async () => {
                const id = faker.datatype.uuid();
                const email = faker.internet.email();
                const password = faker.internet.password();
                const findByEmailStub = sinon.stub().resolves({ id, password });
                const verifyStub = sinon.stub().resolves(true);
                const expectedAccessToken = faker.lorem.word();
                const signStub = sinon.stub().resolves(expectedAccessToken);
                const updateAccessTokenStub = sinon.stub().rejects();

                const sut = makeAuthenticationService(
                    {
                        findByEmail: findByEmailStub,
                        updateAccessToken: updateAccessTokenStub,
                    },
                    {
                        verify: verifyStub,
                    },
                    {
                        sign: signStub,
                    },
                );

                await expect(sut.authenticate(email, password)).to.eventually.be.rejected;
                expect(findByEmailStub).to.have.been.calledOnceWithExactly(email, ["id", "password"]);
                expect(verifyStub).to.have.been.calledOnceWithExactly(password, password);
                expect(signStub).to.have.been.calledOnceWithExactly(id);
                expect(updateAccessTokenStub).to.have.been.calledOnceWithExactly(id, expectedAccessToken);
            });
        });

        context("deauthenticate method", () => {
            it("should deauthenticate a user by id", async () => {
                const id = faker.datatype.uuid();
                const updateAccessToken = sinon.stub().resolves();

                const sut = makeAuthenticationService({
                    updateAccessToken,
                });

                await sut.deauthenticate(id);

                expect(updateAccessToken).to.have.been.calledOnceWithExactly(id, null);
            });

            it("should throw if userRepository.updateAccessToken throws", async () => {
                const id = faker.datatype.uuid();
                const updateAccessToken = sinon.stub().rejects();

                const sut = makeAuthenticationService({
                    updateAccessToken,
                });

                await expect(sut.deauthenticate(id)).to.eventually.be.rejected;
                expect(updateAccessToken).to.have.been.calledOnceWithExactly(id, null);
            });
        });
    });
});
