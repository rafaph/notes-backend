import { Controller } from "@app/presentation/shared/protocol/controller";
import { makeDatabaseAuthenticate } from "@app/main/factory/use-case/authentication/make-database-authenticate";
import { makeLoginValidator } from "@app/main/factory/controller/authentication/login/make-login-validator";
import { LoginController } from "@app/presentation/authentication/controller/login-controller";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";

export function makeLoginController(): Controller {
    const databaseAuthenticate = makeDatabaseAuthenticate();
    const validator = makeLoginValidator();

    const controller = new LoginController(validator, databaseAuthenticate);
    return new LogControllerDecorator(controller);
}
