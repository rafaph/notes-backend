import { Controller } from "@app/shared/presentation/protocol/controller";
import { LoginController } from "@app/authentication/presentation/controller/login-controller";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";
import { makeLoginValidator } from "@app/main/factory/login/make-login-validator";
import { DatabaseAuthenticate } from "@app/authentication/data/use-case/database-authenticate";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/account/sequelize-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { Argon2Adapter } from "@app/authentication/infrastructure/cryptography/argon2-adapter";
import { JWTAdapter } from "@app/authentication/infrastructure/cryptography/jwt-adapter";

export function makeLoginController(): Controller {
    const validator = makeLoginValidator();
    const sequelize = SequelizeClient.getClient();
    const accountRepository = new SequelizeAccountRepository(sequelize);
    const argon2Adapter = new Argon2Adapter();
    const jwtAdapter = new JWTAdapter();
    const databaseAuthenticate = new DatabaseAuthenticate(
        accountRepository,
        argon2Adapter,
        jwtAdapter,
        accountRepository,
    );
    const controller = new LoginController(validator, databaseAuthenticate);

    return new LogControllerDecorator(controller);
}
