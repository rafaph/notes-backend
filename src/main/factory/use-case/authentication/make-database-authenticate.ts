import { Authenticate } from "@app/domain/authentication/use-case/authenticate";
import { Argon2Adapter } from "@app/infrastructure/authentication/cryptography/argon2-adapter";
import { SequelizeClient } from "@app/infrastructure/shared/persistence/sequelize-client";
import { SequelizeAccountRepository } from "@app/infrastructure/authentication/persistence/sequelize/sequelize-account-repository";
import { JWTAdapter } from "@app/infrastructure/authentication/cryptography/jwt-adapter";
import { DatabaseAuthenticate } from "@app/data/authentication/use-case/database-authenticate";

export function makeDatabaseAuthenticate(): Authenticate {
    const argon2Adapter = new Argon2Adapter();
    const sequelize = SequelizeClient.getInstance();
    const sequelizeAccountRepository = new SequelizeAccountRepository(sequelize);
    const jwtAdapter = new JWTAdapter();

    return new DatabaseAuthenticate(
        sequelizeAccountRepository,
        argon2Adapter,
        jwtAdapter,
        sequelizeAccountRepository,
    );
}
