import { Controller } from "@app/presentation/shared/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";
import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";
import { noContent, serverError, unauthorized } from "@app/presentation/shared/helper/http/http-helper";

export class LogoutController implements Controller {
    public constructor(
        private readonly deauthenticate: Deauthenticate,
    ) {
    }

    public async handle(request: LogoutController.Request): Promise<LogoutController.Response> {
        try {
            const id = request.data?.accountId as string;
            const deauthenticated = await this.deauthenticate.execute({ id });

            if (deauthenticated) {
                return noContent();
            }

            return unauthorized();
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace LogoutController {
    interface Data {
        accountId: string;
    }

    export type Request = HttpRequest<unknown, unknown, unknown, Data>;

    export type Response = HttpResponse<Error | undefined>;
}
