import { AccountModel } from "@app/domain/authentication/model/account-model";

export interface LoadAccountByEmailRepository {
    loadByEmail(email: LoadAccountByEmailRepository.Input): Promise<LoadAccountByEmailRepository.Output>;
}

export namespace LoadAccountByEmailRepository {
    export type Input = string;
    export type Output = AccountModel | undefined;
}
