import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/load-account-by-email-repository";

export class DatabaseAuthenticate implements Authenticate {
    public constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    ) {
    }

    public async execute({ email }: Authenticate.Input): Promise<Authenticate.Output> {
        await this.loadAccountByEmailRepository.execute({ email });
        return undefined;
    }
}
