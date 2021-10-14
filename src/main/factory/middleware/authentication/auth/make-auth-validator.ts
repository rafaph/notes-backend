import { Validator } from "@app/presentation/shared/protocol/validator";
import { CompositeValidator } from "@app/validation/validator/composite-validator";
import { RequiredFieldValidator } from "@app/validation/validator/required-field-validator";
import { MissingHeaderError } from "@app/presentation/shared/error/missing-header-error";
import { TokenValidator } from "@app/validation/validator/token-validator";

export function makeAuthValidator(): Validator {
    const validators = [];

    const requiredFields = ["Authorization"];
    for (const field of requiredFields) {
        validators.push(new RequiredFieldValidator(field, MissingHeaderError));
    }
    validators.push(new TokenValidator("Authorization"));

    return new CompositeValidator(validators);
}
