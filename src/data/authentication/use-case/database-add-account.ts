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
        await this.loadAccountByEmailRepository.loadByEmail(input.email);
        const hashedPassword = await this.hasher.hash(input.password);
        return this.addAccountRepository.add({
            ...input,
            password: hashedPassword,
        });
    }
}
