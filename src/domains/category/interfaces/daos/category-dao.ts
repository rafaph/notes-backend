import { FindOneOptions } from "typeorm";
import { Category } from "@app/domains/category/core/entities/category";
import { CreateCategoryDto } from "@app/domains/category/interfaces/dtos/create-category-dto";
import { CategoryData } from "@app/domains/category/types/category";

export interface ICategoryDAO {
    save(category: CreateCategoryDto): Promise<CategoryData>;
    findOne(options?: FindOneOptions<Category>): Promise<CategoryData | void>;
}
