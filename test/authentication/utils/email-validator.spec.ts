import validator from "validator";
import sinon from "sinon";
import faker from "faker";
import { EmailValidatorAdapter } from "@app/authentication/utils/email-validator";

describe("EmailValidatorAdapter", () => {
    const isEmailStub = sinon.stub(validator, "isEmail");

    beforeEach(() => {
        isEmailStub.returns(true);
    });

    after(() => {
        isEmailStub.restore();
    });

    it("Should return false if validator returns false", () => {
        const sut = new EmailValidatorAdapter();
        isEmailStub.returns(false);
        const isValid = sut.isValid(faker.internet.email());
        expect(isValid).to.be.false;
    });

    it("Should return true if validator returns true", () => {
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid(faker.internet.email());
        expect(isValid).to.be.true;
    });
});
