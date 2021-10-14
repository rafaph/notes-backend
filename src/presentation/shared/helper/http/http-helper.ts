import { HttpResponse } from "@app/presentation/shared/protocol/http";
import { HttpStatusCodes } from "@app/utils/http-status-codes";
import { ServerError } from "@app/presentation/shared/error/server-error";
import { UnauthorizedError } from "@app/presentation/shared/error/unauthorized-error";

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

export function noContent(): HttpResponse {
    return {
        statusCode: HttpStatusCodes.NO_CONTENT
    };
}

export function unauthorized(): HttpResponse<Error> {
    return {
        statusCode: HttpStatusCodes.UNAUTHORIZED,
        body: new UnauthorizedError(),
    };
}

export function forbidden(error: Error): HttpResponse<Error> {
    return {
        statusCode: HttpStatusCodes.FORBIDDEN,
        body: error,
    };
}
