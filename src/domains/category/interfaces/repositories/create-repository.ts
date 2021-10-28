import { CategoryData } from "@app/domains/category/types/category";

export interface ICreateRepository {
    create(options: {
        name: string;
        userId: string;
    }): Promise<CategoryData>;
}
