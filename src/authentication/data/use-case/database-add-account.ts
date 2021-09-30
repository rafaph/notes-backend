import { AddAccount } from "@app/authentication/domain/use-case/add-account";
import { Hasher } from "@app/authentication/data/protocol/hasher";
import { AddAccountRepository } from "@app/authentication/data/protocol/add-account-repository";

export class DatabaseAddAccount implements AddAccount {
    public constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
    ) {
    }

    public async execute(input: AddAccount.Input): Promise<AddAccount.Output> {
        const hashedPassword = await this.hasher.hash(input.password);
        return this.addAccountRepository.execute({
            ...input,
            password: hashedPassword,
        });
    }
}
