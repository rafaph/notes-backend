import { Validator } from "@app/presentation/shared/protocol/validator";
import { RequiredFieldValidator } from "@app/presentation/shared/validator/required-field-validator";
import { FieldsDifferentValidator } from "@app/presentation/shared/validator/fields-different-validator";
import { EmailValidator } from "@app/presentation/shared/validator/email-validator";
import { CompositeValidator } from "@app/presentation/shared/validator/composite-validator";
import { IsEmailValidatorAdapter } from "@app/utils/validator/is-email-validator-adapter";

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
