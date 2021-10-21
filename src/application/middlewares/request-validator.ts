import { AsyncValidationOptions, Schema } from "joi";
import { BAD_REQUEST } from "http-status";
import { ParametersField, RequestHandler } from "@app/domains/common/interfaces/controller";
import { ResponseError } from "@app/domains/common/utils/response-error";

export function requestValidator(
    schema: Schema,
    field: ParametersField | "headers",
    options?: AsyncValidationOptions,
    statusCode?: number,
): RequestHandler {
    return async (req, _res, next): Promise<void> => {
        try {
            await schema.validateAsync(req[field], options);
            next();
        } catch (error: unknown) {
            next(new ResponseError(statusCode ?? BAD_REQUEST, `[${field}] - ${(error as Error).message}`));
        }
    };
}
