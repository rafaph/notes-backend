import { IRouter } from "express";
import { ExpressRouteAdapter } from "@app/main/adapter/express/express-route-adapter";
import { makeSignUpController } from "@app/main/factory/sign-up/make-sign-up-controller";


export function route(router: IRouter): void {
    router.post("/sign-up", ExpressRouteAdapter.adapt(makeSignUpController()));
}
