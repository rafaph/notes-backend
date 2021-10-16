import { Controller } from "@app/presentation/shared/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";
import { LoadAccountById } from "@app/domain/authentication/use-case/load-account-by-id";

export class LogoutController implements Controller {
    public constructor(
        private readonly loadAccountById: LoadAccountById,
    ) {
    }

    public async handle(request: HttpRequest<unknown, unknown, unknown, { accountId: string }>): Promise<HttpResponse> {
        const id = request.data?.accountId as string;
        await this.loadAccountById.execute({ id });
        return {
            statusCode: 200,
        };
    }
}
