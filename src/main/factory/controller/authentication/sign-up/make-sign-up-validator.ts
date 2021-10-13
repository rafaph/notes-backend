import { Validator } from "@app/presentation/shared/protocol/validator";
import { RequiredFieldValidator } from "@app/validation/validator/required-field-validator";
import { FieldsDifferentValidator } from "@app/validation/validator/fields-different-validator";
import { EmailValidator } from "@app/validation/validator/email-validator";
import { CompositeValidator } from "@app/validation/validator/composite-validator";
import { IsEmailValidatorAdapter } from "@app/infrastructure/validator/is-email-validator-adapter";

export function makeSignUpValidator(): Validator {
    const validators = [];

    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFields) {
        validators.push(new RequiredFieldValidator(field));
    }

    validators.push(new FieldsDifferentValidator("password", "passwordConfirmation"));
    validators.push(new EmailValidator("email", new IsEmailValidatorAdapter()));

    return new CompositeValidator(validators);
}
