import { FindOneOptions } from "typeorm";
import { User } from "@app/domains/user/core/entities/user";
import { UserWithID, UserWithRelations } from "@app/domains/user/types/user";

export interface IUserDAO {
    save(user: UserWithRelations): Promise<UserWithID>;
    findOne(options?: FindOneOptions<User>): Promise<UserWithID | void>;
}
