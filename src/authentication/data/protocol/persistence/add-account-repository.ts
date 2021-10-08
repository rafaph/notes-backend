import { AddAccount } from "@app/authentication/domain/use-case/add-account";

export interface AddAccountRepository {
    add(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output>;
}

export namespace AddAccountRepository {
    export type Input = AddAccount.Input;
    export type Output = AddAccount.Output;
}
