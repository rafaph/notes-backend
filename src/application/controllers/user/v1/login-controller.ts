import { OK } from "http-status";
import Joi from "joi";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { requestValidator } from "@app/application/middlewares/request-validator";
import { Controller, Request, Response } from "@app/domains/common/interfaces/controller";
import { IAuthenticateAuthenticationService } from "@app/domains/user/interfaces/in/authentication-service";

namespace LoginController {
    export interface Request {
        email: string;
        password: string;
    }

    export type Response = {
        access_token: string;
    };
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "Controller", useClass: LoginController }])
export class LoginController extends Controller<LoginController.Request, LoginController.Response> {
    private readonly schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    public middlewares = [requestValidator(this.schema, "body")];

    public constructor(
        @inject("AuthenticationService") private readonly authenticationService: IAuthenticateAuthenticationService,
    ) {
        super("post", "/api/v1/login");
    }

    public async handle(req: Request<LoginController.Request>, res: Response<LoginController.Response>): Promise<void> {
        const { email, password } = req.body;
        const accessToken = await this.authenticationService.authenticate(email, password);

        res.status(OK).json({
            access_token: accessToken,
        });
    }
}
