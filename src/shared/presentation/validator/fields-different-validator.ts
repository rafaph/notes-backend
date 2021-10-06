import _ from "lodash";
import { Validator } from "@app/shared/presentation/protocol/validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";

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
