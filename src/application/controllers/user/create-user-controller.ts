import { Lifecycle, registry, scoped } from "tsyringe";
import Joi from "joi";
import Controller, { Request, Response } from "@app/domains/common/interfaces/controller";
import { requestValidator } from "@app/application/middlewares/request-validator";

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
@registry([{ token: "Controller", useClass: CreateUserController }])
export default class CreateUserController extends Controller<
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
        super("post", "/signup");
    }

    public handle(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _req: Request<CreateUserController.Request, "body">,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _res: Response<CreateUserController.Response>,
    ): Promise<void> {
        // TODO: implement me
        return Promise.resolve(undefined);
    }
}
