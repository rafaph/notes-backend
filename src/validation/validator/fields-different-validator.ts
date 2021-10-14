import _ from "lodash";
import { InvalidParameterError } from "@app/presentation/shared/error/invalid-parameter-error";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { Newable } from "@app/utils/newable";

export class FieldsDifferentValidator implements Validator {
    public constructor(
        private readonly fieldName: string,
        private readonly fieldNameToCompare: string,
        private readonly errorClass: Newable<Error> = InvalidParameterError
    ) {
    }

    public async validate(input: unknown): Promise<Error | null> {
        if (_.get(input, this.fieldName) !== _.get(input, this.fieldNameToCompare)) {
            return new this.errorClass(this.fieldNameToCompare);
        }

        return null;
    }
}
