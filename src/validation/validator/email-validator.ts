import _ from "lodash";
import { InvalidParameterError } from "@app/presentation/shared/error/invalid-parameter-error";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { IsEmailValidator } from "@app/validation/protocol/is-email-validator";
import { Newable } from "@app/utils/newable";

export class EmailValidator implements Validator {
    public constructor(
        private readonly fieldName: string,
        private readonly emailValidator: IsEmailValidator,
        private readonly errorClass: Newable<Error> = InvalidParameterError
    ) {
    }

    public async validate(input: unknown): Promise<Error | null> {
        if (!this.emailValidator.isValid(_.get(input, this.fieldName))) {
            return new this.errorClass(this.fieldName);
        }

        return null;
    }
}
