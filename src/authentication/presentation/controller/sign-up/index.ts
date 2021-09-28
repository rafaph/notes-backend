import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter";
import { badRequest, serverError } from "@app/shared/presentation/helper/http-helper";
import { Controller } from "@app/shared/presentation/protocol/controller";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter";

export class SignUpController implements Controller {
    public constructor(private readonly emailValidator: EmailValidator) {
    }

    public async handle(request: HttpRequest<SignUpController.RequestBody>): Promise<HttpResponse<SignUpController.ResponseBody>> {
        if (request.body === undefined) {
            return serverError();
        }

        try {
            const requiredFields: SignUpController.RequestBodyKey[] = [
                "name",
                "email",
                "password",
                "passwordConfirmation",
            ];

            for (const requiredField of requiredFields) {
                if (request.body[requiredField] === undefined) {
                    return badRequest(new MissingParameterError(requiredField));
                }
            }

            if (request.body.password !== request.body.passwordConfirmation) {
                return badRequest(new InvalidParameterError("passwordConfirmation"));
            }

            if (!this.emailValidator.isValid(request.body.email as string)) {
                return badRequest(new InvalidParameterError("email"));
            }

            return {
                statusCode: 200,
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    password: "any_password",
                },
            };
        } catch {
            return serverError();
        }
    }
}

export namespace SignUpController {
    export interface RequestBody {
        name?: string;
        email?: string;
        password?: string;
        passwordConfirmation?: string;
    }

    export type RequestBodyKey = keyof RequestBody;

    export type ResponseBody = Error | { name: string; email: string; password: string };
}
