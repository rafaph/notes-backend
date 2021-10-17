import { UserData, UserPayload } from "@app/domains/user/types/user";

export interface ICreateUserService {
    create(user: ICreateUserService.Input): Promise<ICreateUserService.Output>;
}

export namespace ICreateUserService {
    export type Input = Omit<UserPayload, "access_token">;
    export type Output = Pick<UserData, "email" | "name">;
}

// eslint-disable-next-line
export interface IUserService extends ICreateUserService {}
