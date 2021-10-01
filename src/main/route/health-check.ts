import { IRouter, Request, Response } from "express";

export function route(router: IRouter): void {
    router.get("/health-check", (_request: Request, response: Response) => {
        response.json({
            ok: "heath-checked"
        });
    });
}
