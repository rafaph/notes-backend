import _ from "lodash";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { Newable } from "@app/utils/newable";
import { InvalidHeaderError } from "@app/presentation/shared/error/invalid-header-error";

export class TokenValidator implements Validator {
    public constructor(
        private readonly fieldName: string,
        private readonly errorClass: Newable<Error> = InvalidHeaderError,
    ) {
    }

    public async validate(input: unknown): Promise<Error | null> {
        const token = _.get(input, this.fieldName);

        if (
            typeof token !== "string" ||
            !token.startsWith("Bearer ") ||
            token.substring(7).length === 0
        ) {
            return new this.errorClass(this.fieldName);
        }

        return null;
    }
}
