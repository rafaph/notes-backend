import { FindConditions, FindOneOptions, UpdateResult } from "typeorm";
import { User } from "@app/domains/user/core/entities/user";
import { CreateUserPayload, UpdateUserPayload, UserData } from "@app/domains/user/types/user";

export interface IUserDAO {
    save(user: CreateUserPayload): Promise<UserData>;
    update(whereClause: FindConditions<User>, user: UpdateUserPayload): Promise<UpdateResult>;
    findOne(options?: FindOneOptions<User>): Promise<UserData | void>;
}
