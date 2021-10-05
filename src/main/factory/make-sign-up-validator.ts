import { Validator } from "@app/shared/presentation/protocol/validator";
import { CompositeValidator } from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";

export function makeSignUpValidator(): Validator {
    const validators = [];

    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFields) {
        validators.push(new RequiredFieldValidator(field));
    }

    return new CompositeValidator(validators);
}
