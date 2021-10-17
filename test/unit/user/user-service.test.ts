import _ from "lodash";
import { expect } from "chai";
import sinon from "sinon";
import faker from "faker";
import { UserService } from "@app/domains/user/services/user-service";
import { userServiceFactory } from "@test/helpers/user-factories";
import { ICreateUserService } from "@app/domains/user/interfaces/in/user-service";
import { FORBIDDEN } from "http-status";

describe("UserService @unit", () => {
    afterEach(() => {
        sinon.restore();
    });

    describe("Sanity tests", () => {
        it("should exists #sanity", () => {
            expect(UserService).to.be.not.null;
            expect(UserService).to.be.not.undefined;
        });

        it("should be a class #sanity", () => {
            expect(userServiceFactory()).to.be.instanceOf(UserService);
        });

        it("should implements IUserService #sanity", () => {
            const instance = userServiceFactory();
            expect(instance.create).to.be.instanceOf(Function);
        });
    });

    describe("Unit tests", () => {
        context("create method", () => {
            const makeInput = (): ICreateUserService.Input => ({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            });

            it("should create an user", async () => {
                const input = makeInput();
                const findByEmail = sinon.stub().resolves();
                const create = sinon.stub().resolves({
                    name: input.name,
                    email: input.email,
                });
                const hash = sinon.stub().resolves(input.password);
                const sut = userServiceFactory(
                    {
                        findByEmail,
                        create,
                    },
                    {
                        hash,
                    },
                );

                const result = await sut.create(input);

                expect(result).to.be.deep.equal(_.pick(input, ["name", "email"]));
                expect(findByEmail).to.have.been.calledOnceWithExactly(input.email, ["id"]);
                expect(hash).to.have.been.calledOnceWithExactly(input.password);
                expect(create).to.have.been.calledOnceWithExactly({
                    ...input,
                    access_token: null,
                });
            });

            it("should throw if userRepository.findByEmail returns a user", async () => {
                const input = makeInput();
                const findByEmail = sinon.stub().resolves(true);
                const sut = userServiceFactory({
                    findByEmail,
                });

                await expect(sut.create(input)).to.eventually.be.rejected.with.property("status", FORBIDDEN);
                expect(findByEmail).to.have.been.calledOnce;
            });

            it("should throw if userRepository.findByEmail throws", async () => {
                const input = makeInput();
                const findByEmail = sinon.stub().rejects();
                const sut = userServiceFactory({
                    findByEmail,
                });

                await expect(sut.create(input)).to.eventually.be.rejected;
                expect(findByEmail).to.have.been.calledOnce;
            });

            it("should throw if userRepository.create throws", async () => {
                const input = makeInput();
                const create = sinon.stub().rejects();
                const sut = userServiceFactory({
                    create,
                });

                await expect(sut.create(input)).to.eventually.be.rejected;
                expect(create).to.have.been.calledOnce;
            });

            it("should throw if hashing.create hash", async () => {
                const input = makeInput();
                const hash = sinon.stub().rejects();
                const sut = userServiceFactory(undefined, {
                    hash,
                });

                await expect(sut.create(input)).to.eventually.be.rejected;
                expect(hash).to.have.been.calledOnce;
            });
        });
    });
});
