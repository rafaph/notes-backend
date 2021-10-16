import { AccountModel } from "@app/domain/authentication/model/account-model";

export interface AddAccountRepository {
    add(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output>;
}

export namespace AddAccountRepository {
    export interface Input {
        name: string;
        email: string;
        password: string;
    }
    export type Output = AccountModel;
}
