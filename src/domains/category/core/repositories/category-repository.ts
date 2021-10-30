import { INTERNAL_SERVER_ERROR } from "http-status";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { ICategoryDAO } from "@app/domains/category/interfaces/daos/category-dao";
import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { ICategoryRepository } from "@app/domains/category/interfaces/repositories/category-repository";
import { CategoryData } from "@app/domains/category/types/category";
import { Logger } from "@app/domains/common/utils/logger";
import { ResponseError } from "@app/domains/common/utils/response-error";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "CategoryRepository", useClass: CategoryRepository }])
export class CategoryRepository implements ICategoryRepository {
    public constructor(@inject("CategoryDAO") private readonly categoryDAO: ICategoryDAO) {}

    public async create(category: CreateCategoryDto): Promise<CategoryData> {
        try {
            return await this.categoryDAO.save(category);
        } catch (error) {
            const message = "Unable to create category";
            Logger.error(message, error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, message);
        }
    }

    public async findByNameAndUserId(
        name: string,
        userId: string,
        fields?: Array<keyof CategoryData>,
    ): Promise<CategoryData | void> {
        try {
            return await this.categoryDAO.findOne({
                where: {
                    name: name,
                    user_id: userId,
                },
                select: fields,
            });
        } catch (error) {
            const message = "Unable to find category by name";
            Logger.error(message, error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, message);
        }
    }
}
