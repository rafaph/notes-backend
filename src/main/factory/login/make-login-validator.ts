import { Validator } from "@app/shared/presentation/protocol/validator";
import { CompositeValidator } from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";
import { IsEmailValidator } from "@app/shared/presentation/validator/is-email-validator";
import { EmailValidatorAdapter } from "@app/authentication/utils/email-validator-adapter";

export function makeLoginValidator(): Validator {
    const validators = [];

    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
        validators.push(new RequiredFieldValidator(field));
    }

    validators.push(new IsEmailValidator("email", new EmailValidatorAdapter()));

    return new CompositeValidator(validators);
}
