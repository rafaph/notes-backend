import { RequestHandler } from "@app/domains/common/interfaces/controller";

export abstract class Middleware {
    public abstract readonly handle: RequestHandler;
}
