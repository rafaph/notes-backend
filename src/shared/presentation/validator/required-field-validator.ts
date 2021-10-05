import _ from "lodash";
import { Validator } from "@app/shared/presentation/protocol/validator";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";

export class RequiredFieldValidator implements Validator {
    public constructor(private readonly fieldName: string) {
    }

    public async validate(input: unknown): Promise<Error | undefined> {
        if (!_.has(input, this.fieldName)) {
            return new MissingParameterError(this.fieldName);
        }

        return undefined;
    }
}
