import { SequelizeClient } from "@app/infrastructure/shared/persistence/sequelize-client";
import { SequelizeAccountRepository } from "@app/infrastructure/authentication/persistence/sequelize/sequelize-account-repository";
import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";
import { DatabaseDeauthenticate } from "@app/data/authentication/use-case/database-deauthenticate";

export function makeDatabaseDeauthenticate(): Deauthenticate {
    const sequelize = SequelizeClient.getInstance();
    const sequelizeAccountRepository = new SequelizeAccountRepository(sequelize);

    return new DatabaseDeauthenticate(
        sequelizeAccountRepository,
        sequelizeAccountRepository,
    );
}
