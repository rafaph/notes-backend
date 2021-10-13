import { Middleware } from "@app/presentation/shared/protocol/middleware";
import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";
import { forbidden } from "@app/presentation/shared/helper/http/http-helper";
import { AccessDeniedError } from "@app/presentation/shared/error/access-denied-error";

export class AuthMiddleware implements Middleware {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async handle(_request: HttpRequest): Promise<HttpResponse> {
        return forbidden(new AccessDeniedError());
    }
}
