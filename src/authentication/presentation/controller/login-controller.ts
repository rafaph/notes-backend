import { Controller } from "@app/shared/presentation/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { badRequest } from "@app/shared/presentation/helper/http-helper";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";

interface RequestBody {
    email?: string;
    password?: string;
}

type ResponseBody = Error;

export class LoginController implements Controller {
    public async handle(_request: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
        return badRequest(new MissingParameterError("email"));
    }
}
