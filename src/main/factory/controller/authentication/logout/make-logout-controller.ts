import { Controller } from "@app/presentation/shared/protocol/controller";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";
import { LogoutController } from "@app/presentation/authentication/controller/logout-controller";
import { makeDatabaseDeauthenticate } from "@app/main/factory/use-case/authentication/make-database-deauthenticate";

export function makeLogoutController(): Controller {
    const databaseDeauthenticate = makeDatabaseDeauthenticate();
    const controller = new LogoutController(databaseDeauthenticate);

    return new LogControllerDecorator(controller);
}
