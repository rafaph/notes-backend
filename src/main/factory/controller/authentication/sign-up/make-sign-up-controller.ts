import { Controller } from "@app/shared/presentation/protocol/controller";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up-controller";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";
import { makeSignUpValidator } from "@app/main/factory/controller/authentication/sign-up/make-sign-up-validator";
import { makeDatabaseAuthenticate } from "@app/main/factory/use-case/authentication/make-database-authenticate";
import { makeDatabaseAddAccount } from "@app/main/factory/use-case/authentication/make-database-add-account";

export function makeSignUpController(): Controller {
    const databaseAuthenticate = makeDatabaseAuthenticate();
    const databaseAddAccount = makeDatabaseAddAccount();
    const validator = makeSignUpValidator();

    const controller = new SignUpController(databaseAuthenticate, databaseAddAccount, validator);
    return new LogControllerDecorator(controller);
}
