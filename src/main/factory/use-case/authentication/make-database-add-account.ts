import { AddAccount } from "@app/domain/authentication/use-case/add-account";
import { Argon2Adapter } from "@app/infrastructure/authentication/cryptography/argon2-adapter";
import { SequelizeClient } from "@app/infrastructure/authentication/persistence/sequelize/sequelize-client";
import { SequelizeAccountRepository } from "@app/infrastructure/authentication/persistence/sequelize/sequelize-account-repository";
import { DatabaseAddAccount } from "@app/data/authentication/use-case/database-add-account";

export function makeDatabaseAddAccount(): AddAccount {
    const argon2Adapter = new Argon2Adapter();
    const sequelize = SequelizeClient.getInstance();
    const sequelizeAccountRepository = new SequelizeAccountRepository(sequelize);

    return new DatabaseAddAccount(
        argon2Adapter,
        sequelizeAccountRepository,
    );
}
