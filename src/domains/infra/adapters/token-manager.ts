import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Lifecycle, registry, scoped } from "tsyringe";
import { ITokenManager } from "@app/domains/common/interfaces/token-manager";
import { JWT_SECRET } from "@app/domains/common/utils/environment";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { Logger } from "@app/domains/common/utils/logger";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "TokenManager", useClass: TokenManager }])
export class TokenManager implements ITokenManager {
    private readonly secret: string = JWT_SECRET;

    public sign(value: string): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign({ data: value }, this.secret, (err: Error | null, encoded?: string) => {
                if (err) {
                    Logger.error("Fail to sign value with jsonwebtoken", err);
                    reject(new ResponseError(undefined, "Fail to sign value with jsonwebtoken."));
                } else {
                    resolve(encoded as string);
                }
            });
        });
    }

    public verify(token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err: VerifyErrors | null, decoded?: JwtPayload) => {
                if (err) {
                    Logger.error("Fail to verify value with jsonwebtoken", err);
                    reject(new ResponseError(undefined, "Fail to verify value with jsonwebtoken."));
                } else {
                    resolve(decoded?.data);
                }
            });
        });
    }
}
