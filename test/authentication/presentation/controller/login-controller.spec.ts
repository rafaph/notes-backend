import sinon from "sinon";
import faker from "faker";
import { LoginController } from "@app/authentication/presentation/controller/login-controller";
import { badRequest, ok, serverError, unauthorized } from "@app/shared/presentation/helper/http-helper";
import { ServerError } from "@app/shared/presentation/error/server-error";
import { HttpRequest } from "@app/shared/presentation/protocol/http";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { UnauthorizedError } from "@app/shared/presentation/error/unauthorized-error";
import { Validator } from "@app/shared/presentation/protocol/validator";

const makeValidator = (): Validator => {
    class ValidatorStub implements Validator {
        public async validate(): Promise<Error | undefined> {
            return undefined;
        }
    }

    return new ValidatorStub();
};

const FAKE_TOKEN = faker.datatype.uuid();

const makeAuthenticate = (): Authenticate => {
    class AuthenticateStub implements Authenticate {
        public async execute(): Promise<Authenticate.Output> {
            return FAKE_TOKEN;
        }
    }

    return new AuthenticateStub();
};

const makeSut = (): {
    sut: LoginController;
    validatorStub: Validator;
    authenticateStub: Authenticate;
} => {
    const validatorStub = makeValidator();
    const authenticateStub = makeAuthenticate();
    const sut = new LoginController(validatorStub, authenticateStub);
    return {
        sut,
        validatorStub,
        authenticateStub,
    };
};

const makeRequest = (body: LoginController.RequestBody = {}): HttpRequest<LoginController.RequestBody> => ({
    body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...body,
    },
});

describe("LoginController", () => {
    it("Should call Validator with correct value", async () => {
        const { sut, validatorStub } = makeSut();
        const validateSpy = sinon.spy(validatorStub, "validate");
        const request = makeRequest();

        await sut.handle(request);

        sinon.assert.calledOnceWithExactly(validateSpy, request.body);
    });

    it("Should returns a bad request response if Validator fails", async () => {
        const { sut, validatorStub } = makeSut();
        const error = new Error();
        sinon.stub(validatorStub, "validate").resolves(error);
        const request = makeRequest();

        const response = await sut.handle(request);
        const expectedResponse = badRequest(error);

        expect(response).to.be.deep.equal(expectedResponse);
    });

    it("Should return a server error response if Validator throws", async () => {
        const { sut, validatorStub } = makeSut();
        const error = new Error();
        sinon.stub(validatorStub, "validate").rejects(error);
        const request = makeRequest();

        const response = await sut.handle(request);
        const expectedResponse = serverError(error);

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(ServerError);
    });

    it("Should call Authenticate with correct values", async () => {
        const { sut, authenticateStub } = makeSut();
        const executeSpy = sinon.spy(authenticateStub, "execute");
        const body = {
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        const request = makeRequest(body);

        await sut.handle(request);

        sinon.assert.calledOnceWithExactly(executeSpy, body);
    });

    it("Should return a server error response if Authenticate throws", async () => {
        const { sut, authenticateStub } = makeSut();
        sinon.stub(authenticateStub, "execute").rejects();
        const request = makeRequest();

        const response = await sut.handle(request);
        const expectedResponse = serverError();

        expect(response.statusCode).to.be.deep.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(ServerError);
    });

    it("Should return a unauthorized response if invalid credentials are provided", async () => {
        const { sut, authenticateStub } = makeSut();
        sinon.stub(authenticateStub, "execute").resolves(undefined);
        const request = makeRequest();
        const response = await sut.handle(request);
        const expectedResponse = unauthorized();

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(UnauthorizedError);
    });

    it("Should return a ok response if valid credentials are provided", async () => {
        const { sut } = makeSut();
        const request = makeRequest();
        const response = await sut.handle(request);
        const expectedResponse = ok({
            token: FAKE_TOKEN,
        });

        expect(response).to.be.deep.equal(expectedResponse);
    });
});
