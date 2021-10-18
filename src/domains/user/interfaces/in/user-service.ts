import { CreateUserPayload, UserData } from "@app/domains/user/types/user";

export interface ICreateUserService {
    create(input: CreateUserPayload): Promise<UserData>;
}

// eslint-disable-next-line
export interface IUserService extends ICreateUserService {}
