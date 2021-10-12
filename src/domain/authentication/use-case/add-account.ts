import { AccountModel } from "@app/domain/authentication/model/account-model";

export interface AddAccount {
    execute(input: AddAccount.Input): Promise<AddAccount.Output>;
}

export namespace AddAccount {
    export interface Input {
        name: string;
        email: string;
        password: string;
    }

    export type Output = AccountModel | undefined;
}
