import { Controller } from "@app/shared/presentation/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { HttpStatusCodes } from "@app/shared/utils/http-status-codes";
import { Logger } from "@app/shared/utils/logger";

export class LogControllerDecorator implements Controller {
    public constructor(private readonly controller: Controller) {
    }

    public async handle(request: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(request);
        if (response.statusCode === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
            Logger.error("error", response.body);
        }
        return response;
    }
}
