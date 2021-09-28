import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";

export interface Controller {
    handle(request: HttpRequest): Promise<HttpResponse>;
}
