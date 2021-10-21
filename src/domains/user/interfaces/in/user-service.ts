import { CreateUserPayload, UserData } from "@app/domains/user/types/user";

export interface ICreateUserService {
    create(input: CreateUserPayload): Promise<UserData>;
}

export interface ILoadUserByTokenUserService {
    loadByToken(accessToken: string): Promise<UserData>;
}

// eslint-disable-next-line
export interface IUserService extends ICreateUserService, ILoadUserByTokenUserService {}
