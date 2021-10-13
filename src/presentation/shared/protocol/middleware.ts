import { HttpRequest, HttpResponse } from "@app/presentation/shared/protocol/http";

export interface Middleware {
    handle(request: HttpRequest): Promise<HttpResponse>;
}
