import jwt from "jsonwebtoken";
import { Encrypter } from "@app/data/authentication/protocol/cryptography/encrypter";
import { env } from "@app/main/config/env";

export class JWTAdapter implements Encrypter {
    public constructor(
        private readonly secret: string = env.JWT_SECRET,
    ) {
    }

    public async encrypt(value: string): Promise<string> {
        return jwt.sign({ id: value }, this.secret);
    }
}
