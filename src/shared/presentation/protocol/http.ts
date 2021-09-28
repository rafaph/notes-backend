export interface HttpRequest<Body = never, QueryParams = never> {
    body?: Body,
    query?: QueryParams
}

export interface HttpResponse<Body> {
    statusCode: number,
    body: Body
}
