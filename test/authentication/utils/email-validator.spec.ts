import validator from "validator";
import sinon from "sinon";
import faker from "faker";
import { EmailValidatorAdapter } from "@app/authentication/utils/email-validator";

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

describe("EmailValidatorAdapter", () => {
    let isEmailStub: sinon.SinonStub<[
        str: string,
        options?: validator.IsEmailOptions | undefined
    ], boolean>;

    beforeEach(() => {
        isEmailStub = sinon.stub(validator, "isEmail").returns(true);
    });

    afterEach(() => {
        isEmailStub.restore();
    });

    it("Should return false if validator returns false", () => {
        isEmailStub.returns(false);

        const sut = makeSut();
        const isValid = sut.isValid(faker.internet.email());

        expect(isValid).to.be.false;
    });

    it("Should return true if validator returns true", () => {
        const sut = makeSut();
        const isValid = sut.isValid(faker.internet.email());

        expect(isValid).to.be.true;
    });

    it("Should calls validator with correct email", () => {
        const sut = makeSut();
        const email = faker.internet.email();

        sut.isValid(email);

        sinon.assert.callCount(isEmailStub, 1);
        sinon.assert.calledOnceWithExactly(isEmailStub, email);
    });
});
