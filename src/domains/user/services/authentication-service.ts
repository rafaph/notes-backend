import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { UNAUTHORIZED } from "http-status";
import { IAuthenticationService } from "@app/domains/user/interfaces/in/authentication-service";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { IHashing } from "@app/domains/common/interfaces/hashing";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { ITokenManager } from "@app/domains/common/interfaces/token-manager";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "AuthenticationService", useClass: AuthenticationService }])
export class AuthenticationService implements IAuthenticationService {
    private readonly unauthorizedError = new ResponseError(
        UNAUTHORIZED,
        "Unable to find a user with this credentials.",
    );

    public constructor(
        @inject("UserRepository") private readonly userRepository: IUserRepository,
        @inject("Hashing") private readonly hashing: IHashing,
        @inject("TokenManager") private readonly tokenManager: ITokenManager,
    ) {}

    public async authenticate(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email, ["id", "password"]);

        if (!user) {
            throw this.unauthorizedError;
        }

        const isValidPassword = await this.hashing.verify(user.password, password);

        if (!isValidPassword) {
            throw this.unauthorizedError;
        }

        const accessToken = await this.tokenManager.sign(user.id);

        await this.userRepository.updateAccessToken(user.id, accessToken);

        return accessToken;
    }

    public async deauthenticate(id: string): Promise<void> {
        await this.userRepository.updateAccessToken(id, null);
    }
}
