export interface HttpRequest<Body = unknown, Header = unknown, QueryParams = unknown> {
    headers?: Header;
    query?: QueryParams;
    body?: Body;
}

export interface HttpResponse<Body = unknown> {
    statusCode: number;
    body?: Body;
}
