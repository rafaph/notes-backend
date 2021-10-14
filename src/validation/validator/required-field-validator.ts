import _ from "lodash";
import { MissingParameterError } from "@app/presentation/shared/error/missing-parameter-error";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { Newable } from "@app/utils/newable";

export class RequiredFieldValidator implements Validator {
    public constructor(
        private readonly fieldName: string,
        private readonly errorClass: Newable<Error> = MissingParameterError
    ) {
    }

    public async validate(input: unknown): Promise<Error | null> {
        if (!_.has(input, this.fieldName)) {
            return new this.errorClass(this.fieldName);
        }

        return null;
    }
}
