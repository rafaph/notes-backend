import { CategoryData } from "@app/domains/category/types/category";

export interface IFindByNameAndUserIdRepository {
    findByNameAndUserId(name: string, userId: string, fields?: Array<keyof CategoryData>): Promise<CategoryData | void>;
}
