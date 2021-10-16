import { Controller } from "@app/presentation/shared/protocol/controller";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { Authenticate } from "@app/domain/authentication/use-case/authenticate";
import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";
import { badRequest, ok, serverError, unauthorized } from "@app/presentation/shared/helper/http/http-helper";

export class LoginController implements Controller {
    public constructor(
        private readonly validator: Validator,
        private readonly authenticate: Authenticate,
    ) {
    }

    public async handle(request: LoginController.Request): Promise<LoginController.Response> {
        try {
            const error = await this.validator.validate(request.body);
            if (error) {
                return badRequest(error);
            }

            const { email, password } = request.body as Required<LoginController.Body>;

            const token = await this.authenticate.execute({ email, password });

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
    export interface Body {
        email?: string;
        password?: string;
    }

    export type Request = HttpRequest<Body>;

    export type Response = HttpResponse<Error | { token: string }>;
}
