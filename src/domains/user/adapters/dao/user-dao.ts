import { container, Lifecycle, registry, scoped } from "tsyringe";
import { Connection, Repository } from "typeorm";
import { User } from "@app/domains/user/core/entities/user";

@scoped(Lifecycle.ResolutionScoped)
@registry([
    {
        token: "UserDAO",
        useFactory: (): Repository<User> => {
            const connection = container.resolve("DbConnection") as Connection;

            return connection.getRepository(User);
        },
    },
])
export default class UserDAO {}
