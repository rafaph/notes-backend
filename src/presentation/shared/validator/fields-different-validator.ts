import _ from "lodash";
import { InvalidParameterError } from "@app/presentation/shared/error/invalid-parameter-error";
import { Validator } from "@app/presentation/shared/protocol/validator";

export class FieldsDifferentValidator implements Validator {
    public constructor(
        private readonly fieldName: string,
        private readonly fieldNameToCompare: string,
    ) {
    }

    public async validate(input: unknown): Promise<Error | undefined> {
        if (_.get(input, this.fieldName) !== _.get(input, this.fieldNameToCompare)) {
            return new InvalidParameterError(this.fieldNameToCompare);
        }

        return undefined;
    }
}
