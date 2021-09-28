export class ServerError extends Error {
    public constructor(stack?: string) {
        super("Internal server error");
        this.name = "ServerError";

        if (stack !== undefined) {
            this.stack = stack;
        }
    }
}
