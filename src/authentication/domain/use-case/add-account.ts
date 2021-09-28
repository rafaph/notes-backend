import { AccountModel } from "@app/authentication/domain/model/account";

export interface AddAccount {
    execute(input: AddAccount.Input): Promise<AddAccount.Output>;
}

export namespace AddAccount {
    export interface Input {
        name: string;
        email: string;
        password: string;
    }

    export type Output = AccountModel;
}
