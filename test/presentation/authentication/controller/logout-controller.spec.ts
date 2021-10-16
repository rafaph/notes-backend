import sinon from "sinon";
import faker from "faker";
import { LogoutController } from "@app/presentation/authentication/controller/logout-controller";
import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";
import { noContent, serverError, unauthorized } from "@app/presentation/shared/helper/http/http-helper";

const makeDeauthenticate = (): Deauthenticate => {
    class DeauthenticateStub implements Deauthenticate {
        public async execute(): Promise<Deauthenticate.Output> {
            return true;
        }
    }

    return new DeauthenticateStub();
};

const makeSut = (): {
    sut: LogoutController
    deauthenticateStub: Deauthenticate
} => {
    const deauthenticateStub = makeDeauthenticate();
    return {
        sut: new LogoutController(deauthenticateStub),
        deauthenticateStub,
    };
};

describe("LogoutController", () => {
    it("Should call Deauthenticate with correct value", async () => {
        const { sut, deauthenticateStub } = makeSut();
        const executeSpy = sinon.spy(deauthenticateStub, "execute");
        const accountId = faker.datatype.uuid();

        await sut.handle({
            data: { accountId },
        });

        sinon.assert.calledOnceWithExactly(executeSpy, { id: accountId });
    });

    it("Should return a internal server response if Deauthenticate throws", async () => {
        const { sut, deauthenticateStub } = makeSut();
        const error = new Error();
        sinon.stub(deauthenticateStub, "execute").rejects(error);

        const response = await sut.handle({});
        const expectedResponse = serverError(error);

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(expectedResponse.body?.constructor);
    });

    it("Should return a unauthorized response if Deauthenticate returns false", async () => {
        const { sut, deauthenticateStub } = makeSut();
        sinon.stub(deauthenticateStub, "execute").resolves(false);

        const response = await sut.handle({});
        const expectedResponse = unauthorized();

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(expectedResponse.body?.constructor);
    });

    it("Should return a no content response on success", async () => {
        const { sut } = makeSut();

        const response = await sut.handle({});
        const expectedResponse = noContent();

        expect(response).to.be.deep.equal(expectedResponse);
    });
});
