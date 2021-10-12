import faker from "faker";
import sinon from "sinon";
import { InvalidParameterError } from "@app/presentation/shared/error/invalid-parameter-error";
import { IsEmailValidator } from "@app/presentation/authentication/protocol/is-email-validator";
import { EmailValidator } from "@app/presentation/shared/validator/email-validator";


const makeIsEmailValidator = (): IsEmailValidator => {
    class IsEmailValidatorStub implements IsEmailValidator {
        public isValid(): boolean {
            return true;
        }
    }

    return new IsEmailValidatorStub();
};

const makeSut = (): {
    sut: EmailValidator,
    isEmailValidatorStub: IsEmailValidator,
} => {
    const isEmailValidatorStub = makeIsEmailValidator();
    return {
        sut: new EmailValidator("email", isEmailValidatorStub),
        isEmailValidatorStub,
    };
};

describe("EmailValidator", () => {
    it("Should call IsEmailValidator with correct email", async () => {
        const { sut, isEmailValidatorStub } = makeSut();
        const isValidSpy = sinon.spy(isEmailValidatorStub, "isValid");
        const email = faker.internet.email();

        await sut.validate({ email });

        sinon.assert.calledOnceWithExactly(isValidSpy, email);
    });

    it("Should throw if IsEmailValidator throws", async () => {
        const { sut, isEmailValidatorStub } = makeSut();
        sinon.stub(isEmailValidatorStub, "isValid").throwsException();
        const email = faker.internet.email();

        await expect(sut.validate({ email })).to.eventually.be.rejected;
    });

    it("Should return an InvalidParameterError if isValid returns false", async () => {
        const { sut, isEmailValidatorStub } = makeSut();
        sinon.stub(isEmailValidatorStub, "isValid").returns(false);
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
