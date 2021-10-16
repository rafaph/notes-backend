import { IRouter } from "express";
import { ExpressRouteAdapter } from "@app/main/adapter/express-route-adapter";
import { makeLoginController } from "@app/main/factory/controller/authentication/login/make-login-controller";
import { makeSignUpController } from "@app/main/factory/controller/authentication/sign-up/make-sign-up-controller";
import { ExpressMiddlewareAdapter } from "@app/main/adapter/express-middleware-adapter";
import { makeAuthMiddleware } from "@app/main/factory/middleware/authentication/auth/make-auth-middleware";
import { makeLogoutController } from "@app/main/factory/controller/authentication/logout/make-logout-controller";


export function route(router: IRouter): void {
    router.post("/login", ExpressRouteAdapter.adapt(makeLoginController()));
    router.post("/sign-up", ExpressRouteAdapter.adapt(makeSignUpController()));
    router.post(
        "/logout",
        ExpressMiddlewareAdapter.adapt(makeAuthMiddleware()),
        ExpressRouteAdapter.adapt(makeLogoutController()),
    );
}
