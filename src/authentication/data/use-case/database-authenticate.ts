import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/load-account-by-email-repository";
import { Hasher } from "@app/authentication/data/protocol/cryptography/hasher";
import { TokenGenerator } from "@app/authentication/data/protocol/cryptography/token-generator";
import { UpdateAccessTokenRepository } from "@app/authentication/data/protocol/persistence/update-access-token-repository";

export class DatabaseAuthenticate implements Authenticate {
    public constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hasher: Hasher,
        private readonly tokenGenerator: TokenGenerator,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    ) {
    }

    public async execute({ email, password }: Authenticate.Input): Promise<Authenticate.Output> {
        const account = await this.loadAccountByEmailRepository.execute({ email });

        if (account) {
            const isValidPassword = await this.hasher.verify(account.password, password);

            if (isValidPassword) {
                const token = await this.tokenGenerator.generate(account.id);

                await this.updateAccessTokenRepository.execute(account.id, token);
                return token;
            }
        }

        return undefined;
    }
}
