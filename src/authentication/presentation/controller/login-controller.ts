import { Controller } from "@app/shared/presentation/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { badRequest, serverError } from "@app/shared/presentation/helper/http-helper";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";

export interface RequestBody {
    email?: string;
    password?: string;
}

export type ResponseBody = Error;

export class LoginController implements Controller {
    public async handle(request: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
        if (request.body === undefined) {
            return serverError();
        }

        if (!request.body.email) {
            return badRequest(new MissingParameterError("email"));
        }

        if (!request.body.password) {
            return badRequest(new MissingParameterError("password"));
        }

        return {
            statusCode: 200
        };
    }
}
