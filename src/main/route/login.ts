import { IRouter } from "express";
import { ExpressRouteAdapter } from "@app/main/adapter/express/express-route-adapter";
import { makeLoginController } from "@app/main/factory/login/make-login-controller";


export function route(router: IRouter): void {
    router.post("/login", ExpressRouteAdapter.adapt(makeLoginController()));
}
