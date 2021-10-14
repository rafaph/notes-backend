import jwt from "jsonwebtoken";
import { Encrypter } from "@app/data/authentication/protocol/cryptography/encrypter";
import { env } from "@app/main/config/env";
import { Decrypter } from "@app/data/authentication/protocol/cryptography/decrypter";

export class JWTAdapter implements Encrypter, Decrypter {
    public constructor(
        private readonly secret: string = env.JWT_SECRET,
    ) {
    }

    public async encrypt(value: string): Promise<string> {
        return jwt.sign({ id: value }, this.secret);
    }

    public async decrypt(value: string): Promise<{ id: string }> {
        return jwt.verify(value, this.secret) as { id: string };
    }
}
