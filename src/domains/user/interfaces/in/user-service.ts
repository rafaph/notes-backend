import { UserBasicFields, UserPayloadWithoutAccessToken } from "@app/domains/user/types/user";

export interface ICreateUserService {
    create(input: UserPayloadWithoutAccessToken): Promise<UserBasicFields>;
}

// eslint-disable-next-line
export interface IUserService extends ICreateUserService {}
