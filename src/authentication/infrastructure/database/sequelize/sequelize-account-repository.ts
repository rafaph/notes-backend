import { Sequelize } from "sequelize";
import { AddAccountRepository } from "@app/authentication/data/protocol/persistence/add-account-repository";
import { AccountFactory, SequelizeAccount } from "@app/authentication/infrastructure/database/sequelize/model/account";

export class SequelizeAccountRepository implements AddAccountRepository {
    private readonly account: SequelizeAccount;

    public constructor(sequelize: Sequelize) {
        this.account = AccountFactory(sequelize);
    }

    public add(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output> {
        return this.account.create(input);
    }
}
