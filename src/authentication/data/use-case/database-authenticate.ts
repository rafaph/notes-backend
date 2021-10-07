import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/load-account-by-email-repository";
import { Hasher } from "@app/authentication/data/protocol/cryptography/hasher";

export class DatabaseAuthenticate implements Authenticate {
    public constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hasher: Hasher,
    ) {
    }

    public async execute({ email, password }: Authenticate.Input): Promise<Authenticate.Output> {
        const account = await this.loadAccountByEmailRepository.execute({ email });

        if (!account) {
            return undefined;
        }

        await this.hasher.verify(account.password, password);

        return undefined;

    }
}
