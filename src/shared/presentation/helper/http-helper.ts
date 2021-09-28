import { HttpResponse } from "@app/shared/presentation/protocol/http";
import { ServerError } from "@app/shared/presentation/error/server";
import { HttpStatusCodes } from "@app/shared/utils/http-status-codes";

export const badRequest = (error: Error): HttpResponse<Error> => ({
    statusCode: HttpStatusCodes.BAD_REQUEST,
    body: error,
});

export const serverError = (): HttpResponse<Error> => ({
    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    body: new ServerError(),
});

export function ok<Body>(body: Body): HttpResponse<Body> {
    return {
        statusCode: HttpStatusCodes.OK,
        body
    };
}
