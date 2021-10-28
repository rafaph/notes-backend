import { CREATED } from "http-status";
import Joi from "joi";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { requestValidator } from "@app/application/middlewares/request-validator";
import { Controller, Request, Response } from "@app/domains/common/interfaces/controller";
import { IAuthenticateAuthenticationService } from "@app/domains/user/interfaces/in/authentication-service";
import { ICreateUserService } from "@app/domains/user/interfaces/in/user-service";

namespace SignUpController {
    export interface Request {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }

    export type Response = {
        access_token: string;
    };
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "Controller", useClass: SignUpController }])
export class SignUpController extends Controller<SignUpController.Request, SignUpController.Response> {
    private readonly schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.ref("password"),
    });

    public middlewares = [requestValidator(this.schema, "body")];

    public constructor(
        @inject("UserService") private readonly userService: ICreateUserService,
        @inject("AuthenticationService") private readonly authenticationService: IAuthenticateAuthenticationService,
    ) {
        super("post", "/api/v1/sign-up");
    }

    public async handle(
        req: Request<SignUpController.Request>,
        res: Response<SignUpController.Response>,
    ): Promise<void> {
        const userData = await this.userService.create(req.body);
        const accessToken = await this.authenticationService.authenticate(userData.email, req.body.password);

        res.status(CREATED).json({
            access_token: accessToken,
        });
    }
}
