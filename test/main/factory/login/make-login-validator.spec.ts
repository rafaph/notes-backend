import sinon from "sinon";
import * as compositeModule from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";
import { EmailValidator } from "@app/shared/presentation/validator/email-validator";
import { IsEmailValidatorAdapter } from "@app/main/adapter/validator/is-email-validator-adapter";
import { makeLoginValidator } from "@app/main/factory/controller/authentication/login/make-login-validator";

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
