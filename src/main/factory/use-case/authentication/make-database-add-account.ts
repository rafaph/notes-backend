import { AddAccount } from "@app/authentication/domain/use-case/add-account";
import { DatabaseAddAccount } from "@app/authentication/data/use-case/database-add-account";
import { Argon2Adapter } from "@app/authentication/infrastructure/cryptography/argon2-adapter";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/account/sequelize-account-repository";

export function makeDatabaseAddAccount(): AddAccount {
    const argon2Adapter = new Argon2Adapter();
    const sequelize = SequelizeClient.getClient();
    const sequelizeAccountRepository = new SequelizeAccountRepository(sequelize);

    return new DatabaseAddAccount(
        argon2Adapter,
        sequelizeAccountRepository,
    );
}
