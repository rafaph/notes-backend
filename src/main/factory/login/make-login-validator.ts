import { Validator } from "@app/shared/presentation/protocol/validator";
import { CompositeValidator } from "@app/shared/presentation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";
import { EmailValidator } from "@app/shared/presentation/validator/email-validator";
import { IsEmailValidatorAdapter } from "@app/main/adapter/validator/is-email-validator-adapter";


export function makeLoginValidator(): Validator {
    const validators = [];

    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
        validators.push(new RequiredFieldValidator(field));
    }

    validators.push(new EmailValidator("email", new IsEmailValidatorAdapter()));

    return new CompositeValidator(validators);
}
