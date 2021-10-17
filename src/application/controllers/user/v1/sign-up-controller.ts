import { Lifecycle, registry, scoped } from "tsyringe";
import { CREATED } from "http-status";
import Joi from "joi";
import { requestValidator } from "@app/application/middlewares/request-validator";
import { Controller, Request, Response } from "@app/domains/common/interfaces/controller";

namespace CreateUserController {
    export interface Request {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }

    export interface Response {
        name: string;
        email: string;
    }
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "Controller", useClass: SignUpController }])
export class SignUpController extends Controller<
    CreateUserController.Request,
    CreateUserController.Response
> {
    private readonly schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.ref("password"),
    });

    public middlewares = [requestValidator(this.schema, "body")];

    public constructor() {
        super("post", "/api/v1/sign-up");
    }

    public async handle(
        req: Request<CreateUserController.Request, "body">,
        res: Response<CreateUserController.Response>,
    ): Promise<void> {
        res.status(CREATED).json(req.body);
    }
}
