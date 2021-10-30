import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { CategoryData } from "@app/domains/category/types/category";

export interface ICreateRepository {
    create(category: CreateCategoryDto): Promise<CategoryData>;
}
