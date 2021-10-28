import { CategoryData } from "@app/domains/category/types/category";

export interface IFindByNameRepository {
    findByName(options: {
        name: string;
        userId: string;
        fields?: Array<keyof CategoryData>;
    }): Promise<CategoryData | void>;
}
