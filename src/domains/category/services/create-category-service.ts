import { FORBIDDEN } from "http-status";
import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { ICreateRepository } from "@app/domains/category/interfaces/repositories/create-repository";
import { IFindByNameRepository } from "@app/domains/category/interfaces/repositories/find-by-name-repository";
import { ICreateCategoryService } from "@app/domains/category/interfaces/services/create-category-service";
import { CategoryData } from "@app/domains/category/types/category";
import { ResponseError } from "@app/domains/common/utils/response-error";

export class CreateCategoryService implements ICreateCategoryService {
    public constructor(private readonly categoryRepository: ICreateRepository & IFindByNameRepository) {}

    public async create(data: CreateCategoryDto): Promise<CategoryData> {
        const foundCategory = await this.categoryRepository.findByName({
            ...data,
            fields: ["id"],
        });

        if (foundCategory) {
            throw new ResponseError(FORBIDDEN, "The provided category name is already in use.");
        }

        return this.categoryRepository.create(data);
    }
}
