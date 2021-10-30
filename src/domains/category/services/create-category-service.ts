import { FORBIDDEN } from "http-status";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { ICreateRepository } from "@app/domains/category/interfaces/repositories/create-repository";
import { IFindByNameAndUserIdRepository } from "@app/domains/category/interfaces/repositories/find-by-name-and-user-id-repository";
import { ICreateCategoryService } from "@app/domains/category/interfaces/services/create-category-service";
import { CategoryData } from "@app/domains/category/types/category";
import { ResponseError } from "@app/domains/common/utils/response-error";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "CreateCategoryService", useClass: CreateCategoryService }])
export class CreateCategoryService implements ICreateCategoryService {
    public constructor(
        @inject("CategoryRepository")
        private readonly categoryRepository: ICreateRepository & IFindByNameAndUserIdRepository,
    ) {}

    public async create(data: CreateCategoryDto): Promise<CategoryData> {
        const foundCategory = await this.categoryRepository.findByNameAndUserId(data.name, data.user_id, ["id"]);

        if (foundCategory) {
            throw new ResponseError(FORBIDDEN, "The provided category name is already in use.");
        }

        return this.categoryRepository.create(data);
    }
}
