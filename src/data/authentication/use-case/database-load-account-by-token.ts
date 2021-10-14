import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { Decrypter } from "@app/data/authentication/protocol/cryptography/decrypter";
import { LoadAccountByTokenRepository } from "@app/data/authentication/protocol/persistence/load-account-by-token-repository";

export class DatabaseLoadAccountByToken implements LoadAccountByToken {
    public constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    ) {
    }

    public async execute(input: LoadAccountByToken.Input): Promise<LoadAccountByToken.Output> {
        await this.decrypter.decrypt(input.accessToken);
        await this.loadAccountByTokenRepository.loadByToken(input.accessToken);
        return undefined;
    }
}
