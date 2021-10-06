import sinon from "sinon";
import * as compositeModule from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";
import { IsEmailValidator } from "@app/shared/presentation/validator/is-email-validator";
import { EmailValidatorAdapter } from "@app/authentication/utils/email-validator-adapter";
import { makeLoginValidator } from "@app/main/factory/login/make-login-validator";


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

        validators.push(new IsEmailValidator("email", new EmailValidatorAdapter()));

        sinon.assert.calledOnceWithExactly(constructorStub, validators);
    });
});
