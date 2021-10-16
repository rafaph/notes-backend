import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";
import { LoadAccountByIdRepository } from "@app/data/authentication/protocol/persistence/load-account-by-id-repository";
import { UpdateAccessTokenRepository } from "@app/data/authentication/protocol/persistence/update-access-token-repository";

export class DatabaseDeauthenticate implements Deauthenticate {
    public constructor(
        private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    ) {
    }

    public async execute(input: Deauthenticate.Input): Promise<Deauthenticate.Output> {
        const account = await this.loadAccountByIdRepository.loadById(input.id);
        if (account) {
            await this.updateAccessTokenRepository.updateAccessToken({
                id: account.id,
                accessToken: null,
            });
            return true;
        }
        return false;
    }
}
