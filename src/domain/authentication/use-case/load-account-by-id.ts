import { AccountModel } from "@app/domain/authentication/model/account-model";

export interface LoadAccountById {
    execute(input: LoadAccountById.Input): Promise<LoadAccountById.Output>;
}

export namespace LoadAccountById {
    export interface Input {
        id: string;
    }

    export type Output = AccountModel | null;
}
