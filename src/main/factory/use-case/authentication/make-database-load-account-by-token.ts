import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { DatabaseLoadAccountByToken } from "@app/data/authentication/use-case/database-load-account-by-token";
import { JWTAdapter } from "@app/infrastructure/authentication/cryptography/jwt-adapter";
import { SequelizeClient } from "@app/infrastructure/shared/persistence/sequelize-client";
import { SequelizeAccountRepository } from "@app/infrastructure/authentication/persistence/sequelize/sequelize-account-repository";

export function makeDatabaseLoadAccountByToken(): LoadAccountByToken {
    const decrypter = new JWTAdapter();
    const sequelize = SequelizeClient.getInstance();
    const sequelizeAccountRepository = new SequelizeAccountRepository(sequelize);

    return new DatabaseLoadAccountByToken(decrypter, sequelizeAccountRepository);
}
