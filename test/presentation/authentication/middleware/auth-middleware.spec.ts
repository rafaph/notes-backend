import faker from "faker";
import sinon from "sinon";
import { badRequest, forbidden, noContent, serverError } from "@app/presentation/shared/helper/http/http-helper";
import { AuthMiddleware } from "@app/presentation/authentication/middleware/auth-middleware";
import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { AccessDeniedError } from "@app/presentation/shared/error/access-denied-error";

const makeValidator = (): Validator => {
    class ValidatorStub implements Validator {
        public async validate(): Promise<Error | undefined> {
            return undefined;
        }
    }

    return new ValidatorStub();
};

const makeLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        public async execute(): Promise<LoadAccountByToken.Output> {
            return {
                name: faker.name.firstName(),
                password: faker.internet.password(),
                email: faker.internet.email(),
                id: faker.datatype.uuid(),
            };
        }
    }

    return new LoadAccountByTokenStub();
};

const makeHeaders = (token: string = faker.datatype.uuid()): Record<string, string> => {
    return {
        Authorization: `Bearer ${token}`,
    };
};

const makeSut = (): {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
    validatorStub: Validator
} => {
    const loadAccountByTokenStub = makeLoadAccountByToken();
    const validatorStub = makeValidator();
    return {
        sut: new AuthMiddleware(validatorStub, loadAccountByTokenStub),
        loadAccountByTokenStub,
        validatorStub,
    };
};


describe("AuthMiddleware", () => {
    it("Should call Validator with correct value", async () => {
        const { sut, validatorStub } = makeSut();
        const validateSpy = sinon.spy(validatorStub, "validate");
        const headers = makeHeaders();

        await sut.handle({ headers });

        sinon.assert.calledOnceWithExactly(validateSpy, headers);
    });

    it("Should return a internal server error response if Validator throws", async () => {
        const { sut, validatorStub } = makeSut();
        sinon.stub(validatorStub, "validate").rejects();

        const response = await sut.handle({});
        const expectedResponse = serverError();

        expect(response.statusCode).to.be.equals(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(expectedResponse.body?.constructor);
    });

    it("Should return a bad request response if Validator returns an Error", async () => {
        const { sut, validatorStub } = makeSut();
        sinon.stub(validatorStub, "validate").resolves(new Error());

        const response = await sut.handle({});
        const expectedResponse = badRequest(new Error());

        expect(response.statusCode).to.be.equals(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(expectedResponse.body?.constructor);
    });

    it("Should call LoadAccountByToken with correct accessToken", async () => {
        const { sut, loadAccountByTokenStub } = makeSut();
        const executeSpy = sinon.spy(loadAccountByTokenStub, "execute");
        const accessToken = faker.datatype.uuid();
        const headers = makeHeaders(accessToken);
        await sut.handle({ headers });

        sinon.assert.calledOnceWithExactly(executeSpy, { accessToken });
    });

    it("Should return a internal server error response if LoadAccountByToken throws", async () => {
        const { sut, loadAccountByTokenStub } = makeSut();
        sinon.stub(loadAccountByTokenStub, "execute").rejects();
        const response = await sut.handle({});
        const expectedResponse = serverError();

        expect(response.statusCode).to.be.equals(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(expectedResponse.body?.constructor);
    });

    it("Should return a forbidden response if LoadAccountByToken returns no account", async () => {
        const { sut, loadAccountByTokenStub } = makeSut();
        sinon.stub(loadAccountByTokenStub, "execute").resolves(undefined);

        const response = await sut.handle({ headers: makeHeaders() });
        const expectedResponse = forbidden(new AccessDeniedError());

        expect(response.statusCode).to.be.equals(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(expectedResponse.body?.constructor);
    });

    it("Should return noContent if Authorization header has a valid token", async () => {
        const { sut } = makeSut();

        const response = await sut.handle({ headers: makeHeaders() });
        const expectedResponse = noContent();

        expect(response.statusCode).to.be.equals(expectedResponse.statusCode);
    });
});
