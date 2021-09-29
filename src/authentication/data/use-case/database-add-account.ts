import { AddAccount } from "@app/authentication/domain/use-case/add-account";
import { Encrypter } from "@app/authentication/data/protocol/encrypter";
import { AddAccountRepository } from "@app/authentication/data/protocol/add-account-repository";

export class DatabaseAddAccount implements AddAccount {
    public constructor(
        private readonly encrypter: Encrypter,
        private readonly addAccountRepository: AddAccountRepository,
    ) {
    }

    public async execute(input: AddAccount.Input): Promise<AddAccount.Output> {
        const encryptedPassword = await this.encrypter.encrypt(input.password);
        const account = await this.addAccountRepository.execute({
            ...input,
            password: encryptedPassword,
        });
        return {
            id: account.id,
            name: account.name,
            email: account.email,
            password: account.password,
        };
    }
}
