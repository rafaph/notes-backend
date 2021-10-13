import { Validator } from "@app/presentation/shared/protocol/validator";
import { RequiredFieldValidator } from "@app/validation/validator/required-field-validator";
import { EmailValidator } from "@app/validation/validator/email-validator";
import { CompositeValidator } from "@app/validation/validator/composite-validator";
import { IsEmailValidatorAdapter } from "@app/infrastructure/validation/validator/is-email-validator-adapter";

export function makeLoginValidator(): Validator {
    const validators = [];

    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
        validators.push(new RequiredFieldValidator(field));
    }

    validators.push(new EmailValidator("email", new IsEmailValidatorAdapter()));

    return new CompositeValidator(validators);
}
