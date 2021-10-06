import _ from "lodash";
import { Validator } from "@app/shared/presentation/protocol/validator";
import { IsEmailValidator } from "@app/shared/presentation/protocol/is-email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";

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
