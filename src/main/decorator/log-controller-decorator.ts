import { Controller } from "@app/presentation/shared/protocol/controller";
import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";
import { HttpStatusCodes } from "@app/utils/http-status-codes";
import { Logger } from "@app/utils/logger";

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
