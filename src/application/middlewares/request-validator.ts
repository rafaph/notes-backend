import { Schema, ValidationOptions } from "joi";
import { UNPROCESSABLE_ENTITY } from "http-status";
import { ParametersField, RequestHandler } from "@app/domains/common/interfaces/controller";
import { ResponseError } from "@app/domains/common/utils/response-error";

export function requestValidator(
    schema: Schema,
    field: ParametersField,
    options?: ValidationOptions,
    statusCode?: number,
): RequestHandler {
    return (req, _res, next): void => {
        const result = schema.validate(req[field], options);
        if (result.error) {
            next(new ResponseError(statusCode ?? UNPROCESSABLE_ENTITY, `[${field}] - ${result.error.message}`));
            return;
        }
        next();
    };
}
