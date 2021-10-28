import faker from "faker";
import sinon from "sinon";
import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { ICreateRepository } from "@app/domains/category/interfaces/repositories/create-repository";
import { IFindByNameRepository } from "@app/domains/category/interfaces/repositories/find-by-name-repository";
import { CreateCategoryService } from "@app/domains/category/services/create-category-service";
import { CategoryData } from "@app/domains/category/types/category";

export function makeCreateCategoryDto(createCategoryDto: Partial<CreateCategoryDto> = {}): CreateCategoryDto {
    return {
        name: faker.name.firstName(),
        userId: faker.datatype.uuid(),
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
    categoryRepository: Partial<ICreateRepository & IFindByNameRepository> = {},
): CreateCategoryService {
    return new CreateCategoryService({
        create: sinon.stub(),
        findByName: sinon.stub(),
        ...categoryRepository,
    });
}
