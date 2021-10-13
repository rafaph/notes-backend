import sinon from "sinon";
import * as compositeModule from "@app/validation/validator/composite-validator";
import { makeLoginValidator } from "@app/main/factory/controller/authentication/login/make-login-validator";
import { RequiredFieldValidator } from "@app/validation/validator/required-field-validator";
import { EmailValidator } from "@app/validation/validator/email-validator";
import { IsEmailValidatorAdapter } from "@app/infrastructure/validator/is-email-validator-adapter";

describe("makeLoginValidator", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("Should call CompositeValidator with correct validator", () => {
        const compositeValidatorStub = sinon.createStubInstance(compositeModule.CompositeValidator);
        const constructorStub = sinon.stub(compositeModule, "CompositeValidator").onFirstCall().returns(compositeValidatorStub);

        makeLoginValidator();

        const validators = [];

        const requiredFields = ["email", "password"];
        for (const field of requiredFields) {
            validators.push(new RequiredFieldValidator(field));
        }

        validators.push(new EmailValidator("email", new IsEmailValidatorAdapter()));

        sinon.assert.calledOnceWithExactly(constructorStub, validators);
    });
});
