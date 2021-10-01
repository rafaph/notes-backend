import { Controller } from "@app/shared/presentation/protocol/controller";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up-controller";
import { EmailValidatorAdapter } from "@app/authentication/utils/email-validator-adapter";
import { DatabaseAddAccount } from "@app/authentication/data/use-case/database-add-account";
import { HasherArgon2Adapter } from "@app/authentication/infrastructure/hashing/hasher-argon2-adapter";
import { argon2id } from "argon2";
import { SequelizeAddAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-add-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";

export function makeSignUpController(): Controller {
    const emailValidator = new EmailValidatorAdapter();
    const argon2Hasher = new HasherArgon2Adapter(argon2id);
    const sequelize = SequelizeClient.getClient();
    const databaseAddAccountRepository = new SequelizeAddAccountRepository(sequelize);
    const databaseAddAccount = new DatabaseAddAccount(argon2Hasher, databaseAddAccountRepository);
    return new SignUpController(emailValidator, databaseAddAccount);
}
