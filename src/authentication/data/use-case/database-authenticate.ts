import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/load-account-by-email-repository";
import { Hasher } from "@app/authentication/data/protocol/cryptography/hasher";
import { TokenGenerator } from "@app/authentication/data/protocol/cryptography/token-generator";

export class DatabaseAuthenticate implements Authenticate {
    public constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hasher: Hasher,
        private readonly tokenGenerator: TokenGenerator,
    ) {
    }

    public async execute({ email, password }: Authenticate.Input): Promise<Authenticate.Output> {
        const account = await this.loadAccountByEmailRepository.execute({ email });

        if (!account) {
            return undefined;
        }

        const isValidPassword = await this.hasher.verify(account.password, password);

        if (!isValidPassword) {
            return undefined;
        }

        return this.tokenGenerator.generate(account.id);
    }
}
