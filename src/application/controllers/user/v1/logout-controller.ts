import _ from "lodash";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { NO_CONTENT } from "http-status";
import { Controller, Request, Response } from "@app/domains/common/interfaces/controller";
import { Middleware } from "@app/domains/common/interfaces/middleware";
import { IDeauthenticateAuthenticationService } from "@app/domains/user/interfaces/in/authentication-service";
import { UserData } from "@app/domains/user/types/user";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "Controller", useClass: LogoutController }])
export class LogoutController extends Controller<void, void> {
    public middlewares = [this.authMiddleware.handle];

    public constructor(
        @inject("IsAuthenticatedMiddleware") private readonly authMiddleware: Middleware,
        @inject("AuthenticationService") private readonly authenticationService: IDeauthenticateAuthenticationService,
    ) {
        super("post", "/api/v1/logout");
    }

    public async handle(req: Request<void>, res: Response<void>): Promise<void> {
        const { id } = _.get(req, "user") as UserData;

        await this.authenticationService.deauthenticate(id);

        res.status(NO_CONTENT).end();
    }
}
