import { expect } from "chai";
import sinon from "sinon";
import { FORBIDDEN } from "http-status";
import { UserService } from "@app/domains/user/services/user-service";
import { makeCreateUserPayload, makeUserData, makeUserService } from "@test/helpers/user-factories";

describe("UserService @unit", () => {
    describe("Sanity tests", () => {
        it("should exists", () => {
            expect(UserService).to.be.not.null;
            expect(UserService).to.be.not.undefined;
        });

        it("should be a class", () => {
            expect(makeUserService()).to.be.instanceOf(UserService);
        });

        it("should implements IUserService", () => {
            const instance = makeUserService();
            expect(instance.create).to.be.instanceOf(Function);
        });
    });

    describe("Unit tests", () => {
        context("create method", () => {
            it("should create an user", async () => {
                const input = makeCreateUserPayload();
                const output = makeUserData();

                const findByEmail = sinon.stub().resolves();
                const create = sinon.stub().resolves(output);
                const hash = sinon.stub().resolves(input.password);

                const sut = makeUserService(
                    {
                        findByEmail,
                        create,
                    },
                    {
                        hash,
                    },
                );

                const result = await sut.create(input);

                expect(result).to.be.deep.equal(output);
                expect(findByEmail).to.have.been.calledOnceWithExactly(input.email, ["id"]);
                expect(hash).to.have.been.calledOnceWithExactly(input.password);
                expect(create).to.have.been.calledOnceWithExactly(input);
            });

            it("should throw if userRepository.findByEmail returns a user", async () => {
                const input = makeCreateUserPayload();
                const findByEmail = sinon.stub().resolves(true);

                const sut = makeUserService({
                    findByEmail,
                });

                await expect(sut.create(input)).to.eventually.be.rejected.with.property("status", FORBIDDEN);
                expect(findByEmail).to.have.been.calledOnce;
            });

            it("should throw if userRepository.findByEmail throws", async () => {
                const input = makeCreateUserPayload();
                const findByEmail = sinon.stub().rejects();

                const sut = makeUserService({
                    findByEmail,
                });

                await expect(sut.create(input)).to.eventually.be.rejected;
                expect(findByEmail).to.have.been.calledOnce;
            });

            it("should throw if userRepository.create throws", async () => {
                const input = makeCreateUserPayload();
                const create = sinon.stub().rejects();

                const sut = makeUserService({
                    create,
                });

                await expect(sut.create(input)).to.eventually.be.rejected;
                expect(create).to.have.been.calledOnce;
            });

            it("should throw if hashing.create hash", async () => {
                const input = makeCreateUserPayload();
                const hash = sinon.stub().rejects();

                const sut = makeUserService(undefined, {
                    hash,
                });

                await expect(sut.create(input)).to.eventually.be.rejected;
                expect(hash).to.have.been.calledOnce;
            });
        });
    });
});
