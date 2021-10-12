import { Controller } from "@app/shared/presentation/protocol/controller";
import { LoginController } from "@app/authentication/presentation/controller/login-controller";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";
import { makeLoginValidator } from "@app/main/factory/controller/authentication/login/make-login-validator";
import { makeDatabaseAuthenticate } from "@app/main/factory/use-case/authentication/make-database-authenticate";

export function makeLoginController(): Controller {
    const databaseAuthenticate = makeDatabaseAuthenticate();
    const validator = makeLoginValidator();

    const controller = new LoginController(validator, databaseAuthenticate);
    return new LogControllerDecorator(controller);
}
