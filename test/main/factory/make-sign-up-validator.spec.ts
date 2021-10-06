import sinon from "sinon";
import { makeSignUpValidator } from "@app/main/factory/make-sign-up-validator";
import * as compositeModule from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";
import { AreFieldsDifferentValidator } from "@app/shared/presentation/validator/are-fields-different-validator";
import { IsEmailValidator } from "@app/shared/presentation/validator/is-email-validator";
import { EmailValidatorAdapter } from "@app/authentication/utils/email-validator-adapter";


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

        validators.push(new AreFieldsDifferentValidator("password", "passwordConfirmation"));
        validators.push(new IsEmailValidator("email", new EmailValidatorAdapter()));

        sinon.assert.calledOnceWithExactly(constructorStub, validators);
    });
});
