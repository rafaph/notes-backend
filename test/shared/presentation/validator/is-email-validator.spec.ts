import faker from "faker";
import sinon from "sinon";
import { IsEmailValidator } from "@app/shared/presentation/validator/is-email-validator";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";


const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public isValid(_email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makeSut = (): {
    sut: IsEmailValidator,
    emailValidatorStub: EmailValidator,
} => {
    const emailValidatorStub = makeEmailValidator();
    return {
        sut: new IsEmailValidator("email", emailValidatorStub),
        emailValidatorStub,
    };
};

describe("IsEmailValidator", () => {
    it("Should call EmailValidator with correct email", async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = sinon.spy(emailValidatorStub, "isValid");
        const email = faker.internet.email();

        await sut.validate({ email });

        sinon.assert.calledOnceWithExactly(isValidSpy, email);
    });

    it("Should throw if EmailValidator throws", async () => {
        const { sut, emailValidatorStub } = makeSut();
        sinon.stub(emailValidatorStub, "isValid").throwsException();
        const email = faker.internet.email();

        await expect(sut.validate({ email })).to.eventually.be.rejected;
    });

    it("Should return an InvalidParameterError if isValid returns false", async () => {
        const { sut, emailValidatorStub } = makeSut();
        sinon.stub(emailValidatorStub, "isValid").returns(false);
        const email = faker.internet.email();
        const result = (await sut.validate({ email })) as InvalidParameterError;
        const expectedError = new InvalidParameterError("email");

        expect(result).to.be.a.instanceOf(InvalidParameterError);
        expect(result.name).to.be.equal(expectedError.name);
        expect(result.message).to.be.equal(expectedError.message);
    });

    it("Should return undefined if isValid returns true", async () => {
        const { sut } = makeSut();
        const result = await sut.validate({
            email: faker.internet.email(),
        });

        expect(result).to.be.undefined;
    });
});
