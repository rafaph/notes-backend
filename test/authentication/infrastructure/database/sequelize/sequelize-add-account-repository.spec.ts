import { Sequelize } from "sequelize";
import { AddAccountRepository } from "@app/authentication/data/protocol/add-account-repository";
import { AccountFactory, SequelizeAccount } from "@app/authentication/infrastructure/database/sequelize/models/account";

export class SequelizeAddAccountRepository implements AddAccountRepository {
    private readonly account: SequelizeAccount;

    public constructor(sequelize: Sequelize) {
        this.account = AccountFactory(sequelize);
    }


    public async execute(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output> {
        const account = await this.account.create({
            name: input.name,
            email: input.email,
            password: input.password,
        });

        return {
            id: account.id,
            name: account.name,
            email: account.email,
            password: account.password,
        };
    }

}
