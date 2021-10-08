import { Sequelize } from "sequelize";
import { AddAccountRepository } from "@app/authentication/data/protocol/persistence/account/add-account-repository";
import { AccountFactory, SequelizeAccount } from "@app/authentication/infrastructure/database/sequelize/account/model/account";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/account/load-account-by-email-repository";
import { fromDatabase } from "@app/authentication/infrastructure/database/sequelize/account/mappers/account";
import { UpdateAccessTokenRepository } from "@app/authentication/data/protocol/persistence/account/update-access-token-repository";

export class SequelizeAccountRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
    private readonly account: SequelizeAccount;

    public constructor(sequelize: Sequelize) {
        this.account = AccountFactory(sequelize);
    }

    public async add(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output> {
        const databaseAccount = await this.account.create(input);
        return fromDatabase(databaseAccount);
    }

    public async loadByEmail(email: LoadAccountByEmailRepository.Input): Promise<LoadAccountByEmailRepository.Output> {
        const account = await this.account.findOne({
            where: {
                email,
            },
        });

        if (account) {
            return account;
        }

        return undefined;
    }

    public async updateAccessToken({ id, accessToken }: UpdateAccessTokenRepository.Input): Promise<UpdateAccessTokenRepository.Output> {
        await this.account.update({
            accessToken,
        }, {
            where: {
                id,
            }
        });
    }
}
