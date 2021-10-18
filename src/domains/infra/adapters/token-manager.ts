import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Lifecycle, registry, scoped } from "tsyringe";
import { ITokenManager } from "@app/domains/common/interfaces/token-manager";
import { JWT_SECRET } from "@app/domains/common/utils/environment";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "TokenManager", useClass: TokenManager }])
export class TokenManager implements ITokenManager {
    private readonly secret: string = JWT_SECRET;

    public sign(value: string): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign({ data: value }, this.secret, (err: Error | null, encoded: string | undefined) => {
                if (!err) {
                    resolve(encoded as string);
                } else {
                    reject(err);
                }
            });
        });
    }

    public verify(token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err: VerifyErrors | null, decoded: JwtPayload | undefined) => {
                if (!err) {
                    resolve(decoded?.data);
                } else {
                    reject(err);
                }
            });
        });
    }
}
