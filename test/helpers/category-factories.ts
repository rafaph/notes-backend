import faker from "faker";
import sinon from "sinon";
import { CategoryRepository } from "@app/domains/category/core/repositories/category-repository";
import { ICategoryDAO } from "@app/domains/category/interfaces/daos/category-dao";
import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { ICreateRepository } from "@app/domains/category/interfaces/repositories/create-repository";
import { IFindByNameAndUserIdRepository } from "@app/domains/category/interfaces/repositories/find-by-name-and-user-id-repository";
import { CreateCategoryService } from "@app/domains/category/services/create-category-service";
import { CategoryData } from "@app/domains/category/types/category";

export function makeCreateCategoryDto(createCategoryDto: Partial<CreateCategoryDto> = {}): CreateCategoryDto {
    return {
        name: faker.name.firstName(),
        user_id: faker.datatype.uuid(),
        ...createCategoryDto,
    };
}

export function makeCategoryData(categoryData: Partial<CategoryData> = {}): CategoryData {
    return {
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        ...categoryData,
    };
}

export function makeCreateCategoryService(
    categoryRepository: Partial<ICreateRepository & IFindByNameAndUserIdRepository> = {},
): CreateCategoryService {
    return new CreateCategoryService({
        create: sinon.stub(),
        findByNameAndUserId: sinon.stub(),
        ...categoryRepository,
    });
}

export function makeCategoryRepository(categoryDAO: Partial<ICategoryDAO> = {}): CategoryRepository {
    return new CategoryRepository({
        findOne: sinon.stub(),
        save: sinon.stub(),
        ...categoryDAO,
    });
}
