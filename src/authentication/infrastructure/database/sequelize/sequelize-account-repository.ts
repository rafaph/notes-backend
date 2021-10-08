import { Sequelize } from "sequelize";
import { AddAccountRepository } from "@app/authentication/data/protocol/persistence/add-account-repository";
import { AccountFactory, SequelizeAccount } from "@app/authentication/infrastructure/database/sequelize/model/account";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/load-account-by-email-repository";

export class SequelizeAccountRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    private readonly account: SequelizeAccount;

    public constructor(sequelize: Sequelize) {
        this.account = AccountFactory(sequelize);
    }

    public add(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output> {
        return this.account.create(input);
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
}
