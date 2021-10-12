export interface HttpRequest<Body = unknown, QueryParams = unknown> {
    body?: Body,
    query?: QueryParams
}

export interface HttpResponse<Body = unknown> {
    statusCode: number,
    body?: Body
}
