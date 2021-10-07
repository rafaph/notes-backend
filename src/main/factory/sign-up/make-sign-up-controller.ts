import { Controller } from "@app/shared/presentation/protocol/controller";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up-controller";
import { DatabaseAddAccount } from "@app/authentication/data/use-case/database-add-account";
import { Argon2Adapter } from "@app/authentication/infrastructure/cryptography/argon2-adapter";
import { SequelizeAddAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-add-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";
import { makeSignUpValidator } from "@app/main/factory/sign-up/make-sign-up-validator";

export function makeSignUpController(): Controller {
    const argon2Adapter = new Argon2Adapter();
    const sequelize = SequelizeClient.getClient();
    const databaseAddAccountRepository = new SequelizeAddAccountRepository(sequelize);
    const databaseAddAccount = new DatabaseAddAccount(argon2Adapter, databaseAddAccountRepository);
    const validator = makeSignUpValidator();
    const controller = new SignUpController(databaseAddAccount, validator);
    return new LogControllerDecorator(controller);
}
