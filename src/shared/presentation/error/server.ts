export class ServerError extends Error {
    public constructor(stack?: string) {
        super("Internal Server Error");
        this.name = "ServerError";

        if (stack !== undefined) {
            this.stack = stack;
        }
    }
}
