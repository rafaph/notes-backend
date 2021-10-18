import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { CREATED } from "http-status";
import Joi from "joi";
import { requestValidator } from "@app/application/middlewares/request-validator";
import { Controller, Request, Response } from "@app/domains/common/interfaces/controller";
import { ICreateUserService } from "@app/domains/user/interfaces/in/user-service";

namespace CreateUserController {
    export interface Request {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }

    export type Response = {
        name: string;
        email: string;
    };
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "Controller", useClass: CreateUserController }])
export class CreateUserController extends Controller<CreateUserController.Request, CreateUserController.Response> {
    private readonly schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.ref("password"),
    });

    public middlewares = [requestValidator(this.schema, "body")];

    public constructor(@inject("UserService") private readonly userService: ICreateUserService) {
        super("post", "/api/v1/sign-up");
    }

    public async handle(
        req: Request<CreateUserController.Request>,
        res: Response<CreateUserController.Response>,
    ): Promise<void> {
        const data = await this.userService.create(req.body);

        res.status(CREATED).json(data);
    }
}
