export interface HttpRequest<Body = unknown, Header = unknown, QueryParams = unknown, Data = unknown> {
    headers?: Header;
    query?: QueryParams;
    body?: Body;
    data?: Data;
}

export interface HttpResponse<Body = unknown> {
    statusCode: number;
    body?: Body;
}
