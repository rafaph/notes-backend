export class MissingParameterError extends Error {
    public readonly paramName: string;

    public constructor(paramName: string) {
        super(`Missing parameter: "${paramName}".`);
        this.paramName = paramName;
        this.name = "MissingParameterError";
    }
}
