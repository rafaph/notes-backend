import { Middleware } from "@app/presentation/shared/protocol/middleware";
import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";
import { badRequest, forbidden, ok, serverError } from "@app/presentation/shared/helper/http/http-helper";
import { AccessDeniedError } from "@app/presentation/shared/error/access-denied-error";
import { Validator } from "@app/presentation/shared/protocol/validator";
import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";

export class AuthMiddleware implements Middleware {
    public constructor(
        private readonly validator: Validator,
        private readonly loadAccountByToken: LoadAccountByToken,
    ) {
    }

    public async handle(request: HttpRequest<unknown, AuthMiddleware.AuthorizationHeader>): Promise<HttpResponse<AuthMiddleware.ResponseBody>> {
        try {
            const error = await this.validator.validate(request.headers);
            if (error) {
                return badRequest(error);
            }

            const headers = request.headers as Required<AuthMiddleware.AuthorizationHeader>;

            const account = await this.loadAccountByToken.execute({
                accessToken: headers.Authorization.substring(7)
            });

            if(!account) {
                return forbidden(new AccessDeniedError());
            }

            return ok({
                accountId: account.id
            });
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace AuthMiddleware {
    export interface AuthorizationHeader {
        Authorization?: string;
    }

    export type ResponseBody = Error | { accountId: string };
}