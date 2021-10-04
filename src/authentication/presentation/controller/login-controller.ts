import { Controller } from "@app/shared/presentation/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { badRequest, serverError } from "@app/shared/presentation/helper/http-helper";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";

export interface RequestBody {
    email?: string;
    password?: string;
}

export type ResponseBody = Error;

export class LoginController implements Controller {
    public constructor(
        private readonly emailValidator: EmailValidator,
        private readonly authenticate: Authenticate,
    ) {
    }

    public async handle(request: HttpRequest<RequestBody>): Promise<HttpResponse<ResponseBody>> {
        if (request.body === undefined) {
            return serverError();
        }

        try {
            const { email, password } = request.body;

            if (!email) {
                return badRequest(new MissingParameterError("email"));
            }

            if (!password) {
                return badRequest(new MissingParameterError("password"));
            }

            const isValid = this.emailValidator.isValid(email);
            if (!isValid) {
                return badRequest(new InvalidParameterError("email"));
            }

            await this.authenticate.execute({ email, password });

            return {
                statusCode: 200,
            };
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
