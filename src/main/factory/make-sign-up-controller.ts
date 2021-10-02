import { Controller } from "@app/shared/presentation/protocol/controller";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up-controller";
import { EmailValidatorAdapter } from "@app/authentication/utils/email-validator-adapter";
import { DatabaseAddAccount } from "@app/authentication/data/use-case/database-add-account";
import { HasherArgon2Adapter } from "@app/authentication/infrastructure/hashing/hasher-argon2-adapter";
import { SequelizeAddAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-add-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";

export function makeSignUpController(): Controller {
    const emailValidator = new EmailValidatorAdapter();
    const argon2Hasher = new HasherArgon2Adapter();
    const sequelize = SequelizeClient.getClient();
    const databaseAddAccountRepository = new SequelizeAddAccountRepository(sequelize);
    const databaseAddAccount = new DatabaseAddAccount(argon2Hasher, databaseAddAccountRepository);
    const controller = new SignUpController(emailValidator, databaseAddAccount);
    return new LogControllerDecorator(controller);
}
