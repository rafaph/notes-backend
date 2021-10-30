import { container, Lifecycle, registry, scoped } from "tsyringe";
import { Connection, Repository } from "typeorm";
import { Category } from "@app/domains/category/core/entities/category";

@scoped(Lifecycle.ResolutionScoped)
@registry([
    {
        token: "CategoryDAO",
        useFactory: (): Repository<Category> => {
            const connection = container.resolve<Connection>("DbConnection");

            return connection.getRepository(Category);
        },
    },
])
export default class CategoryDAO {}
