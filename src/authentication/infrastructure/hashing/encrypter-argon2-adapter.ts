import { Encrypter } from "@app/authentication/data/protocol/encrypter";
import argon2 from "argon2";

export class EncrypterArgon2Adapter implements Encrypter {
    public constructor(private readonly type: argon2.Options["type"]) {
        this.type = type;
    }

    public encrypt(value: string): Promise<string> {
        return argon2.hash(value, {
            type: this.type,
        });
    }

}
