import { Controller } from "@app/shared/presentation/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { badRequest, serverError } from "@app/shared/presentation/helper/http-helper";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";

export class LoginController implements Controller {
    public constructor(
        private readonly emailValidator: EmailValidator,
        private readonly authenticate: Authenticate,
    ) {
    }

    public async handle(request: HttpRequest<LoginController.RequestBody>): Promise<HttpResponse<LoginController.ResponseBody>> {
        if (request.body === undefined) {
            return serverError();
        }

        try {
            const requiredFields: LoginController.RequestBodyKey[] = [
                "email",
                "password",
            ];

            for (const requiredField of requiredFields) {
                if (!request.body[requiredField]) {
                    return badRequest(new MissingParameterError(requiredField));
                }
            }

            const { email, password } = request.body;

            const isValid = this.emailValidator.isValid(email as string);
            if (!isValid) {
                return badRequest(new InvalidParameterError("email"));
            }

            await this.authenticate.execute({
                email: email as string,
                password: password as string,
            });

            return {
                statusCode: 200,
            };
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace LoginController {
    export interface RequestBody {
        email?: string;
        password?: string;
    }

    export type RequestBodyKey = keyof RequestBody;

    export type ResponseBody = Error;
}
