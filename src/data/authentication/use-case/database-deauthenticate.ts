import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";
import { LoadAccountByIdRepository } from "@app/data/authentication/protocol/persistence/load-account-by-id-repository";

export class DatabaseDeauthenticate implements Deauthenticate {
    public constructor(
        private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    ) {
    }

    public async execute(input: Deauthenticate.Input): Promise<Deauthenticate.Output> {
        const account = await this.loadAccountByIdRepository.loadById(input.id);
        if (account) {
            return false;
        }
        return false;
    }
}
