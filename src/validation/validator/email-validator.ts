import _ from "lodash";
import { InvalidParameterError } from "@app/presentation/shared/error/invalid-parameter-error";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { IsEmailValidator } from "@app/validation/protocol/is-email-validator";

export class EmailValidator implements Validator {
    public constructor(
        private readonly fieldName: string,
        private readonly emailValidator: IsEmailValidator,
    ) {
    }

    public async validate(input: unknown): Promise<Error | undefined> {
        if (!this.emailValidator.isValid(_.get(input, this.fieldName))) {
            return new InvalidParameterError(this.fieldName);
        }

        return undefined;
    }
}
