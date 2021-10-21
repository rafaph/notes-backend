import _ from "lodash";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { FORBIDDEN } from "http-status";
import Joi from "joi";
import { Middleware } from "@app/domains/common/interfaces/middleware";
import { RequestHandler } from "@app/domains/common/interfaces/controller";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { ILoadUserByTokenUserService } from "@app/domains/user/interfaces/in/user-service";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "IsAuthenticatedMiddleware", useClass: IsAuthenticatedMiddleware }])
export class IsAuthenticatedMiddleware implements Middleware {
    private readonly schema = Joi.object({
        "x-access-token": Joi.string().required(),
    }).unknown();

    public constructor(@inject("UserService") private readonly userService: ILoadUserByTokenUserService) {}

    public readonly handle: RequestHandler = async (req, _res, next): Promise<void> => {
        const { error, value: headers } = this.schema.validate(req.headers);

        if (error) {
            next(new ResponseError(FORBIDDEN, `[headers] - ${(error as Error).message}`));

            return;
        }

        try {
            const user = await this.userService.loadByToken(headers["x-access-token"]);
            _.set(req, "user", user);
        } catch (error) {
            next(error);

            return;
        }

        next();
    };
}
