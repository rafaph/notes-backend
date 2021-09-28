export class InvalidParameterError extends Error {
    public readonly paramName: string;
    public constructor(paramName: string) {
        super(`Invalid parameter: "${paramName}".`);
        this.paramName = paramName;
        this.name = "InvalidParameterError";
    }
}
