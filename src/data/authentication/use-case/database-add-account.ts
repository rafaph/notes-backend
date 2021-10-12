import { AddAccount } from "@app/domain/authentication/use-case/add-account";
import { Hasher } from "@app/data/authentication/protocol/cryptography/hasher";
import { AddAccountRepository } from "@app/data/authentication/protocol/persistence/add-account-repository";
import { LoadAccountByEmailRepository } from "@app/data/authentication/protocol/persistence/load-account-by-email-repository";

export class DatabaseAddAccount implements AddAccount {
    public constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    ) {
    }

    public async execute(input: AddAccount.Input): Promise<AddAccount.Output> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(input.email);
        if (account) {
            return undefined;
        }

        return this.addAccountRepository.add({
            ...input,
            password: await this.hasher.hash(input.password),
        });
    }
}
