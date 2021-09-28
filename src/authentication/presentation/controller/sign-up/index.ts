import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter";
import { badRequest, ok, serverError } from "@app/shared/presentation/helper/http-helper";
import { Controller } from "@app/shared/presentation/protocol/controller";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter";
import { AddAccount } from "@app/authentication/domain/use-case/add-account";

export class SignUpController implements Controller {
    public constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount,
    ) {
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

            const { name, email, password, passwordConfirmation } = request.body;

            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParameterError("passwordConfirmation"));
            }

            if (!this.emailValidator.isValid(email as string)) {
                return badRequest(new InvalidParameterError("email"));
            }

            const account = await this.addAccount.execute({
                name: name as string,
                email: email as string,
                password: password as string,
            });

            return ok({
                id: account.id,
                name: account.name,
                email: account.email,
                password: account.password,
            });
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

    export type ResponseBody = Error | { id: string; name: string; email: string; password: string };
}
