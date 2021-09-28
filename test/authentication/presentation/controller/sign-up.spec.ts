import faker from "faker";
import sinon from "sinon";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter";
import { ServerError } from "@app/shared/presentation/error/server";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";

const makeSut = (): {
    sut: SignUpController,
    emailValidatorStub: EmailValidator
} => {
    class EmailValidatorStub implements EmailValidator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public isValid(_: string): boolean {
            return true;
        }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);
    return {
        sut,
        emailValidatorStub,
    };
};

describe("SignUpController", () => {
    it("Should return a server error response if no body is provided", async () => {
        const { sut } = makeSut();
        const response = await sut.handle({});

        expect(response.statusCode).to.be.equal(500);
        expect(response.body).to.be.instanceOf(ServerError);
    });

    context("When missing params", () => {
        const keys: SignUpController.RequestBodyKey[] = ["name", "email", "password", "passwordConfirmation"];

        for (const key of keys) {
            it(`Should return a bad request response when no ${key} is provided`, async () => {
                const { sut } = makeSut();
                const password = faker.internet.password();
                const body: SignUpController.RequestBody = {
                    name: faker.name.firstName(),
                    email: faker.internet.email(),
                    password,
                    passwordConfirmation: password,
                    [key]: undefined,
                };
                const response = await sut.handle({ body });

                expect(response.statusCode).to.be.equal(400);
                expect(response.body)
                    .to.be.instanceOf(MissingParameterError)
                    .that.includes({ paramName: key });
            });
        }
    });

    it("Should return a bad request if an invalid email is provided", async () => {
        const { sut, emailValidatorStub } = makeSut();
        const password = faker.internet.password();
        const body: SignUpController.RequestBody = {
            name: faker.name.firstName(),
            email: "invalid_email",
            password,
            passwordConfirmation: password,
        };
        sinon.stub(emailValidatorStub, "isValid").returns(false);
        const response = await sut.handle({ body });

        expect(response.statusCode).to.be.equal(400);
        expect(response.body)
            .to.be.instanceOf(InvalidParameterError)
            .that.includes({ paramName: "email" });
    });

    it("Should call email validator with correct email", async () => {
        const { sut, emailValidatorStub } = makeSut();
        const password = faker.internet.password();
        const body: SignUpController.RequestBody = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            passwordConfirmation: password,
        };
        const isValidEmailSpy = sinon.spy(emailValidatorStub, "isValid");
        await sut.handle({ body });

        expect(isValidEmailSpy.calledOnceWith(body.email as string)).to.be.true;
    });

    it("Should return a server error if EmailValidator throws a error", async () => {
        const { sut, emailValidatorStub } = makeSut();
        const password = faker.internet.password();
        const body: SignUpController.RequestBody = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            passwordConfirmation: password,
        };
        sinon.stub(emailValidatorStub, "isValid").throwsException();
        const response = await sut.handle({ body });

        expect(response.statusCode).to.be.equal(500);
        expect(response.body).to.be.instanceOf(ServerError);
    });

    it("Should return a bad request if passwordConfirmation fails", async () => {
        const { sut } = makeSut();
        const body: SignUpController.RequestBody = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            passwordConfirmation: faker.internet.password(),
        };
        const response = await sut.handle({ body });

        expect(response.statusCode).to.be.equal(400);
        expect(response.body)
            .to.be.instanceOf(InvalidParameterError)
            .that.includes({ paramName: "passwordConfirmation" });
    });
});
