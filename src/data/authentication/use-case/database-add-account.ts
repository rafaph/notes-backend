import { AddAccount } from "@app/domain/authentication/use-case/add-account";
import { Hasher } from "@app/data/authentication/protocol/cryptography/hasher";
import { AddAccountRepository } from "@app/data/authentication/protocol/persistence/add-account-repository";

export class DatabaseAddAccount implements AddAccount {
    public constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
    ) {
    }

    public async execute(input: AddAccount.Input): Promise<AddAccount.Output> {
        const hashedPassword = await this.hasher.hash(input.password);
        return this.addAccountRepository.add({
            ...input,
            password: hashedPassword,
        });
    }
}
