import { AccountModel } from "@app/authentication/domain/model/account-model";

export interface LoadAccountByEmailRepository {
    execute(input: LoadAccountByEmailRepository.Input): Promise<LoadAccountByEmailRepository.Output>;
}

export namespace LoadAccountByEmailRepository {
    export interface Input {
        email: string;
    }
    export type Output = AccountModel | undefined;
}
