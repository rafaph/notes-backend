import { AccountModel } from "@app/domain/authentication/model/account-model";

export interface LoadAccountByToken {
    execute(input: LoadAccountByToken.Input): Promise<LoadAccountByToken.Output>;
}

export namespace LoadAccountByToken {
    export interface Input {
        accessToken: string;
    }

    export type Output = AccountModel | null;
}
