import sinon from "sinon";
import * as compositeModule from "@app/validation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/validation/validator/required-field-validator";
import { makeAuthValidator } from "@app/main/factory/middleware/authentication/auth/make-auth-validator";
import { TokenValidator } from "@app/validation/validator/token-validator";
import { MissingHeaderError } from "@app/presentation/shared/error/missing-header-error";

describe("makeAuthValidator", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("Should call CompositeValidator with correct validator", async () => {
        const compositeValidatorStub = sinon.createStubInstance(compositeModule.CompositeValidator);
        const constructorStub = sinon.stub(compositeModule, "CompositeValidator").onFirstCall().returns(compositeValidatorStub);

        makeAuthValidator();

        const validators = [];

        const requiredFields = ["Authorization"];
        for (const field of requiredFields) {
            validators.push(new RequiredFieldValidator(field, MissingHeaderError));
        }

        validators.push(new TokenValidator("Authorization"));

        sinon.assert.calledOnceWithExactly(constructorStub, validators);
    });
});
