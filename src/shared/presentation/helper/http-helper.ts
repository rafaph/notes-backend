import { HttpResponse } from "@app/shared/presentation/protocol/http";
import { ServerError } from "@app/shared/presentation/error/server";

export const badRequest = (error: Error): HttpResponse<Error> => ({
    statusCode: 400,
    body: error,
});

export const serverError = (): HttpResponse<Error> => ({
    statusCode: 500,
    body: new ServerError(),
});
