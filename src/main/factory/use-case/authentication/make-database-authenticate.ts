import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { Argon2Adapter } from "@app/authentication/infrastructure/cryptography/argon2-adapter";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/account/sequelize-account-repository";
import { JWTAdapter } from "@app/authentication/infrastructure/cryptography/jwt-adapter";
import { DatabaseAuthenticate } from "@app/authentication/data/use-case/database-authenticate";

export function makeDatabaseAuthenticate(): Authenticate {
    const argon2Adapter = new Argon2Adapter();
    const sequelize = SequelizeClient.getClient();
    const sequelizeAccountRepository = new SequelizeAccountRepository(sequelize);
    const jwtAdapter = new JWTAdapter();

    return new DatabaseAuthenticate(
        sequelizeAccountRepository,
        argon2Adapter,
        jwtAdapter,
        sequelizeAccountRepository,
    );
}
