/* eslint-disable */

declare module "jsonwebtoken" {
    export function sign(payload: Record<string, unknown>, secret: string): string;
}
