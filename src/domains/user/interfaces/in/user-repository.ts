import { CreateUserPayload, UserData } from "@app/domains/user/types/user";

export interface IUserCreateRepository {
    create(user: CreateUserPayload): Promise<UserData>;
}

export interface IUserRetrieveByEmailRepository {
    findByEmail(email: string, fields?: Array<keyof UserData>): Promise<UserData | void>;
}

export interface IUserRetrieveByIdRepository {
    findById(id: string, fields?: Array<keyof UserData>): Promise<UserData | void>;
}

export interface IUserUpdateAccessTokenRepository {
    updateAccessToken(id: string, accessToken: string | null): Promise<void>;
}

export interface IUserRepository
    extends IUserCreateRepository,
        IUserRetrieveByIdRepository,
        IUserRetrieveByEmailRepository,
        IUserUpdateAccessTokenRepository {}
