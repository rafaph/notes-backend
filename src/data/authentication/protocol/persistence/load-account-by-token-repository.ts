import { AccountModel } from "@app/domain/authentication/model/account-model";

export interface LoadAccountByTokenRepository {
    loadByToken(accessToken: LoadAccountByTokenRepository.Input): Promise<LoadAccountByTokenRepository.Output>;
}

export namespace LoadAccountByTokenRepository {
    export type Input = string;
    export type Output = AccountModel | undefined;
}
