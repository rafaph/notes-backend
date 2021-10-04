import { HttpResponse } from "@app/shared/presentation/protocol/http";
import { ServerError } from "@app/shared/presentation/error/server-error";
import { HttpStatusCodes } from "@app/shared/utils/http-status-codes";
import { UnauthorizedError } from "@app/shared/presentation/error/unauthorized-error";

export const badRequest = (error: Error): HttpResponse<Error> => ({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    body: error,
});

export const serverError = (error?: Error): HttpResponse<Error> => ({
    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    body: new ServerError(error?.stack),
});

export function ok<Body>(body: Body): HttpResponse<Body> {
    return {
        statusCode: HttpStatusCodes.OK,
        body,
    };
}

export function unauthorized(): HttpResponse<Error> {
    return {
        statusCode: HttpStatusCodes.UNAUTHORIZED,
        body: new UnauthorizedError(),
    };
}
