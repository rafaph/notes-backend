import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { Decrypter } from "@app/data/authentication/protocol/cryptography/decrypter";

export class DatabaseLoadAccountByToken implements LoadAccountByToken {
    public constructor(
        private readonly decrypter: Decrypter,
    ) {
    }

    public async execute(input: LoadAccountByToken.Input): Promise<LoadAccountByToken.Output> {
        await this.decrypter.decrypt(input.accessToken);
        return undefined;
    }
}
