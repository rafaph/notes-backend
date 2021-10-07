import jwt from "jsonwebtoken";
import { Encrypter } from "@app/authentication/data/protocol/cryptography/encrypter";

export class JWTAdapter implements Encrypter {
    public constructor(
        private readonly secret: string,
    ) {
    }

    public async encrypt(value: string): Promise<string> {
        return jwt.sign({ id: value }, this.secret);
    }
}
