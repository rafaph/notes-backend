import { UserPayload, UserWithID } from "@app/domains/user/types/user";

export interface IUserCreateRepository {
    create(user: UserPayload): Promise<UserWithID>;
}

export interface IUserRetrieveByEmailRepository {
    findByEmail(email: string, fields?: Array<keyof UserWithID>): Promise<UserWithID | void>;
}

export interface IUserRepository extends IUserCreateRepository, IUserRetrieveByEmailRepository {}
