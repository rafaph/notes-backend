/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as httpStatus from "http-status";

export class ResponseError extends Error {
    public status: number;
    public statusText: string;
    public code?: string;

    public constructor(status = httpStatus.INTERNAL_SERVER_ERROR, message = httpStatus[status], code?: string) {
        // @ts-ignore
        super(message || "Unknown error");

        this.name = "ResponseError";
        this.status = status;
        //@ts-ignore
        this.statusText = httpStatus[status];
        this.code = code;
    }
}
