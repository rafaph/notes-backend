export class MissingHeaderError extends Error {
    public readonly headerName: string;

    public constructor(headerName: string) {
        super(`Missing header: "${headerName}".`);
        this.headerName = headerName;
        this.name = "MissingHeaderError";
    }
}
