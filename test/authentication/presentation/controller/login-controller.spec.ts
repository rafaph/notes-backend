import faker from "faker";
import { LoginController, RequestBody } from "@app/authentication/presentation/controller/login-controller";
import { badRequest, serverError } from "@app/shared/presentation/helper/http-helper";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";
import { ServerError } from "@app/shared/presentation/error/server-error";
import { HttpRequest } from "@app/shared/presentation/protocol/http";
import sinon from "sinon";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        public isValid(): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makeSut = (): {
    sut: LoginController;
    emailValidatorStub: EmailValidator;
} => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new LoginController(emailValidatorStub);
    return {
        sut,
        emailValidatorStub,
    };
};

const makeRequest = (body: RequestBody = {}): HttpRequest<RequestBody> => ({
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
});
