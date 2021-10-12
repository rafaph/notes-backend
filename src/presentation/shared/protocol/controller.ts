import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";

export interface Controller {
    handle(request: HttpRequest): Promise<HttpResponse>;
}
