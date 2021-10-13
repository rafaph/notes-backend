import sinon from "sinon";
import { makeSignUpValidator } from "@app/main/factory/controller/authentication/sign-up/make-sign-up-validator";
import * as compositeModule from "@app/validation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/validation/validator/required-field-validator";
import { FieldsDifferentValidator } from "@app/validation/validator/fields-different-validator";
import { IsEmailValidatorAdapter } from "@app/infrastructure/validation/validator/is-email-validator-adapter";
import { EmailValidator } from "@app/validation/validator/email-validator";


describe("makeSignUpValidator", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("Should call CompositeValidator with correct validator", () => {
        const compositeValidatorStub = sinon.createStubInstance(compositeModule.CompositeValidator);
        const constructorStub = sinon.stub(compositeModule, "CompositeValidator").onFirstCall().returns(compositeValidatorStub);

        makeSignUpValidator();

        const validators = [];

        const requiredFields = ["name", "email", "password", "passwordConfirmation"];
        for (const field of requiredFields) {
            validators.push(new RequiredFieldValidator(field));
        }

        validators.push(new FieldsDifferentValidator("password", "passwordConfirmation"));
        validators.push(new EmailValidator("email", new IsEmailValidatorAdapter()));

        sinon.assert.calledOnceWithExactly(constructorStub, validators);
    });
});
