import type {
    Request as ExpressRequest,
    Response as ExpressResponse,
    RequestHandler as ExpressRequestHandler,
} from "express";

import { HttpVerb } from "../types/http";

export type ParametersField = "body" | "params" | "query";

export type Request<R, T extends ParametersField = "body"> = T extends "query"
    ? ExpressRequest<unknown, unknown, unknown, R>
    : T extends "body"
    ? ExpressRequest<unknown, unknown, R>
    : T extends "params"
    ? ExpressRequest<R>
    : never;

export type Response<T> = ExpressResponse<T>;

export type RequestHandler = ExpressRequestHandler;

export default abstract class Controller<T, R, F extends ParametersField = "body"> {
    protected constructor(public readonly verb: HttpVerb, public readonly path: string) {}

    public abstract readonly middlewares: RequestHandler[];

    public abstract handle(req: Request<T, F>, res: Response<R>): Promise<void>;
}
