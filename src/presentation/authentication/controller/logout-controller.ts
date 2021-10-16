import { Controller } from "@app/presentation/shared/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";
import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";
import { serverError } from "@app/presentation/shared/helper/http/http-helper";

export class LogoutController implements Controller {
    public constructor(
        private readonly deauthenticate: Deauthenticate,
    ) {
    }

    public async handle(request: HttpRequest<unknown, unknown, unknown, { accountId: string }>): Promise<HttpResponse> {
        try {
            const id = request.data?.accountId as string;
            await this.deauthenticate.execute({ id });

            return {
                statusCode: 200
            };
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
