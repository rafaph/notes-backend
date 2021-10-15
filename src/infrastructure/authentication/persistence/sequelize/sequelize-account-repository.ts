import { Sequelize } from "sequelize";
import { AddAccountRepository } from "@app/data/authentication/protocol/persistence/add-account-repository";
import { AccountFactory, SequelizeAccount } from "@app/infrastructure/authentication/persistence/sequelize/model/account";
import { LoadAccountByEmailRepository } from "@app/data/authentication/protocol/persistence/load-account-by-email-repository";
import { fromDatabase } from "@app/infrastructure/authentication/persistence/sequelize/mappers/account";
import { UpdateAccessTokenRepository } from "@app/data/authentication/protocol/persistence/update-access-token-repository";
import { LoadAccountByTokenRepository } from "@app/data/authentication/protocol/persistence/load-account-by-token-repository";

export class SequelizeAccountRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
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

        return null;
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

    public async loadByToken(accessToken: LoadAccountByTokenRepository.Input): Promise<LoadAccountByTokenRepository.Output> {
        const account = await this.account.findOne({
            where: {
                accessToken,
            },
        });

        if (account) {
            return account;
        }

        return null;
    }
}
