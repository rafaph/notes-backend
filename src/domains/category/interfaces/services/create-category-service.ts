import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { CategoryData } from "@app/domains/category/types/category";

export interface ICreateCategoryService {
    create(data: CreateCategoryDto): Promise<CategoryData>
}
