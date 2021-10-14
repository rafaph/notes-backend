import { Authenticate } from "@app/domain/authentication/use-case/authenticate";
import { LoadAccountByEmailRepository } from "@app/data/authentication/protocol/persistence/load-account-by-email-repository";
import { Encrypter } from "@app/data/authentication/protocol/cryptography/encrypter";
import { UpdateAccessTokenRepository } from "@app/data/authentication/protocol/persistence/update-access-token-repository";
import { HashVerifier } from "@app/data/authentication/protocol/cryptography/hash-verifier";

export class DatabaseAuthenticate implements Authenticate {
    public constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashVerifier: HashVerifier,
        private readonly encrypter: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    ) {
    }

    public async execute({ email, password }: Authenticate.Input): Promise<Authenticate.Output> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(email);

        if (account) {
            const isValidPassword = await this.hashVerifier.verify(account.password, password);

            if (isValidPassword) {
                const accessToken = await this.encrypter.encrypt(account.id);

                await this.updateAccessTokenRepository.updateAccessToken({
                    id: account.id,
                    accessToken,
                });

                return accessToken;
            }
        }

        return null;
    }
}
