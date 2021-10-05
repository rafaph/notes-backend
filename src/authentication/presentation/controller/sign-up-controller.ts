import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { badRequest, ok, serverError } from "@app/shared/presentation/helper/http-helper";
import { Controller } from "@app/shared/presentation/protocol/controller";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";
import { AddAccount } from "@app/authentication/domain/use-case/add-account";
import { Validator } from "@app/shared/presentation/protocol/validator";

export class SignUpController implements Controller {
    public constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount,
        private readonly validator: Validator,
    ) {
    }

    public async handle(request: HttpRequest<SignUpController.RequestBody>): Promise<HttpResponse<SignUpController.ResponseBody>> {
        try {
            const error = await this.validator.validate(request.body);
            if (error) {
                return badRequest(error);
            }

            const { name, email, password } = request.body as SignUpController.RequestBody;

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
            });
        } catch (error) {
            return serverError(error as Error);
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

    export type ResponseBody = Error | Omit<AddAccount.Output, "password">;
}
