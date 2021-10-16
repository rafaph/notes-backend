import { AccountModel } from "@app/domain/authentication/model/account-model";

export interface LoadAccountByIdRepository {
    loadById(id: LoadAccountByIdRepository.Input): Promise<LoadAccountByIdRepository.Output>;
}

export namespace LoadAccountByIdRepository {
    export type Input = string;
    export type Output = AccountModel | null;
}
