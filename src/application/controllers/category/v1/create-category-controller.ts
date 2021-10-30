import { CREATED } from "http-status";
import Joi from "joi";
import _ from "lodash";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { requestValidator } from "@app/application/middlewares/request-validator";
import { ICreateCategoryService } from "@app/domains/category/interfaces/services/create-category-service";
import { CategoryData } from "@app/domains/category/types/category";
import { Controller, Request, Response } from "@app/domains/common/interfaces/controller";
import { Middleware } from "@app/domains/common/interfaces/middleware";
import { UserData } from "@app/domains/user/types/user";

namespace CreateCategoryController {
    export interface Request {
        name: string;
    }

    export type Response = CategoryData;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "Controller", useClass: CreateCategoryController }])
export class CreateCategoryController extends Controller<
    CreateCategoryController.Request,
    CreateCategoryController.Response
> {
    private readonly schema = Joi.object({
        name: Joi.string().required(),
    });

    public middlewares = [requestValidator(this.schema, "body"), this.authMiddleware.handle];

    public constructor(
        @inject("IsAuthenticatedMiddleware") private readonly authMiddleware: Middleware,
        @inject("CreateCategoryService") private readonly categoryService: ICreateCategoryService,
    ) {
        super("post", "/api/v1/category/create");
    }

    public async handle(
        req: Request<CreateCategoryController.Request>,
        res: Response<CreateCategoryController.Response>,
    ): Promise<void> {
        const { id } = _.get(req, "user") as UserData;
        const categoryData = await this.categoryService.create({
            name: req.body.name,
            user_id: id,
        });

        res.status(CREATED).json(categoryData);
    }
}
