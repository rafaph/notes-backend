import { Validator } from "@app/shared/presentation/protocol/validator";
import { CompositeValidator } from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";
import { AreFieldsDifferentValidator } from "@app/shared/presentation/validator/are-fields-different-validator";

export function makeSignUpValidator(): Validator {
    const validators = [];

    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFields) {
        validators.push(new RequiredFieldValidator(field));
    }

    validators.push(new AreFieldsDifferentValidator("password", "passwordConfirmation"));

    return new CompositeValidator(validators);
}
