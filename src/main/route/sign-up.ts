import { IRouter } from "express";
import { ExpressRouteAdapter } from "@app/main/adapter/express-route-adapter";
import { makeSignUpController } from "@app/main/factory/make-sign-up-controller";


export function route(router: IRouter): void {
    router.post("/sign-up", ExpressRouteAdapter.adapt(makeSignUpController()));
}