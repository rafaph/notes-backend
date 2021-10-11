export class EmailInUseError extends Error {
    public constructor() {
        super("The provided email already is in use.");
        this.name = "EmailInUseError";
    }
}
