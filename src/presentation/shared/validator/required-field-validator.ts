import _ from "lodash";
import { MissingParameterError } from "@app/presentation/shared/error/missing-parameter-error";
import { Validator } from "@app/presentation/shared/protocol/validator";

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
