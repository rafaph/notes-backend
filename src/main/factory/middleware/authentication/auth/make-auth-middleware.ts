import { Middleware } from "@app/presentation/shared/protocol/middleware";
import { AuthMiddleware } from "@app/presentation/authentication/middleware/auth-middleware";
import { makeAuthValidator } from "@app/main/factory/middleware/authentication/auth/make-auth-validator";
import { makeDatabaseLoadAccountByToken } from "@app/main/factory/use-case/authentication/make-database-load-account-by-token";

export function makeAuthMiddleware(): Middleware {
    const validator = makeAuthValidator();
    const databaseLoadAccountByToken = makeDatabaseLoadAccountByToken();
    return new AuthMiddleware(validator, databaseLoadAccountByToken);
}
