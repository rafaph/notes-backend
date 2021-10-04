import sinon from "sinon";
import faker from "faker";
import { LoginController } from "@app/authentication/presentation/controller/login-controller";
import { badRequest, serverError, unauthorized } from "@app/shared/presentation/helper/http-helper";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";
import { ServerError } from "@app/shared/presentation/error/server-error";
import { HttpRequest } from "@app/shared/presentation/protocol/http";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { UnauthorizedError } from "@app/shared/presentation/error/unauthorized-error";

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        public isValid(): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const FAKE_TOKEN = faker.datatype.uuid();
const makeAuthenticate = (): Authenticate => {
    class AuthenticateStub implements Authenticate {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public async execute(_input: Authenticate.Input): Promise<Authenticate.Output> {
            return FAKE_TOKEN;
        }
    }

    return new AuthenticateStub();
};

const makeSut = (): {
    sut: LoginController;
    emailValidatorStub: EmailValidator;
    authenticateStub: Authenticate;
} => {
    const emailValidatorStub = makeEmailValidator();
    const authenticateStub = makeAuthenticate();
    const sut = new LoginController(emailValidatorStub, authenticateStub);
    return {
        sut,
        emailValidatorStub,
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

describe.only("LoginController", () => {
    it("Should return a server error if no body is provided", async () => {
        const { sut } = makeSut();
        const request = {};
        const response = await sut.handle(request);
        const expectedResponse = serverError();

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(ServerError);
    });

    it("Should return a bad request if no email is provided", async () => {
        const { sut } = makeSut();
        const request = makeRequest({
            email: undefined,
        });
        const response = await sut.handle(request);
        const expectedResponse = badRequest(new MissingParameterError("email"));

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(MissingParameterError);
        expect(response.body?.message).to.be.equal(expectedResponse.body?.message);
    });

    it("Should return a bad request if no password is provided", async () => {
        const { sut } = makeSut();
        const request = makeRequest({
            password: undefined,
        });
        const response = await sut.handle(request);
        const expectedResponse = badRequest(new MissingParameterError("password"));

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(MissingParameterError);
        expect(response.body?.message).to.be.equal(expectedResponse.body?.message);
    });

    it("Should call EmailValidator with correct value", async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidStub = sinon.stub(emailValidatorStub, "isValid");
        const email = faker.internet.email();
        const request = makeRequest({ email });

        await sut.handle(request);

        sinon.assert.calledOnceWithExactly(isValidStub, email);
    });

    it("Should return a bad request if a invalid email is provided", async () => {
        const { sut, emailValidatorStub } = makeSut();
        const request = makeRequest();
        sinon.stub(emailValidatorStub, "isValid").returns(false);
        const response = await sut.handle(request);
        const expectedResponse = badRequest(new InvalidParameterError("email"));

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(InvalidParameterError);
        expect(response.body?.message).to.be.equal(expectedResponse.body?.message);
    });

    it("Should return a server error if email validator throws", async () => {
        const { sut, emailValidatorStub } = makeSut();
        sinon.stub(emailValidatorStub, "isValid").throwsException();
        const request = makeRequest();
        const response = await sut.handle(request);
        const expectedResponse = serverError();

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(ServerError);
    });

    it("Should call Authenticate with correct values", async () => {
       const { sut, authenticateStub } = makeSut();
       const executeStub = sinon.stub(authenticateStub, "execute");
       const email = faker.internet.email();
       const password = faker.internet.password();
       const body = { email, password };
       const request = makeRequest(body);

       await sut.handle(request);

       sinon.assert.calledOnceWithExactly(executeStub, body);
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
});
