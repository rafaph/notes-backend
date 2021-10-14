import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { Decrypter } from "@app/data/authentication/protocol/cryptography/decrypter";
import { LoadAccountByTokenRepository } from "@app/data/authentication/protocol/persistence/load-account-by-token-repository";

export class DatabaseLoadAccountByToken implements LoadAccountByToken {
    public constructor(
        private readonly decrypter: Decrypter<{id: string}>,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    ) {
    }

    public async execute(input: LoadAccountByToken.Input): Promise<LoadAccountByToken.Output> {
        const payload = await this.decrypter.decrypt(input.accessToken);
        if (payload) {
            const account = await this.loadAccountByTokenRepository.loadByToken(input.accessToken);

            if (account && account.id === payload.id) {
                return account;
            }
        }
        return undefined;
    }
}
