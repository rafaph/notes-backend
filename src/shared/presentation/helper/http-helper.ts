import { HttpResponse } from "@app/shared/presentation/protocol/http";

export const badRequest = (error: Error): HttpResponse<Error> => ({
    statusCode: 400,
    body: error,
});

export const internalServerError = (error: Error): HttpResponse<Error> => ({
    statusCode: 500,
    body: error,
});
