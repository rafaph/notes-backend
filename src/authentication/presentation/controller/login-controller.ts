import { Controller } from "@app/shared/presentation/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { badRequest, ok, serverError, unauthorized } from "@app/shared/presentation/helper/http/http-helper";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { Validator } from "@app/shared/presentation/protocol/validator";

export class LoginController implements Controller {
    public constructor(
        private readonly validator: Validator,
        private readonly authenticate: Authenticate,
    ) {
    }

    public async handle(request: HttpRequest<LoginController.RequestBody>): Promise<HttpResponse<LoginController.ResponseBody>> {
        try {
            const error = await this.validator.validate(request.body);
            if (error) {
                return badRequest(error);
            }

            const { email, password } = request.body as LoginController.RequestBody;

            const token = await this.authenticate.execute({
                email: email as string,
                password: password as string,
            });

            if (!token) {
                return unauthorized();
            }

            return ok({ token });
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

    export type ResponseBody = Error | { token: string };
}
