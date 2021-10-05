import sinon from "sinon";
import { makeSignUpValidator } from "@app/main/factory/make-sign-up-validator";
import * as compositeModule from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";

describe.only("makeSignUpValidator", () => {
    it("Should call CompositeValidator with correct validator", () => {
        const compositeValidatorStub = sinon.createStubInstance(compositeModule.CompositeValidator);
        const constructorStub = sinon.stub(compositeModule, "CompositeValidator").onFirstCall().returns(compositeValidatorStub);

        makeSignUpValidator();

        const validators = [];
        const requiredFields = ["name", "email", "password", "passwordConfirmation"];
        for (const field of requiredFields) {
            validators.push(new RequiredFieldValidator(field));
        }

        sinon.assert.calledOnceWithExactly(constructorStub, validators);
    });
});
