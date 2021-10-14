export class InvalidHeaderError extends Error {
    public readonly headerName: string;

    public constructor(headerName: string) {
        super(`Invalid header: "${headerName}".`);
        this.headerName = headerName;
        this.name = "InvalidHeaderError";
    }
}
