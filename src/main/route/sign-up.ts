import { IRouter, Request, Response } from "express";

export function route(router: IRouter): void {
    router.post("/sign-up", (_request: Request, response: Response) => {
       response.json({
           ok: "ok"
       });
    });
}
