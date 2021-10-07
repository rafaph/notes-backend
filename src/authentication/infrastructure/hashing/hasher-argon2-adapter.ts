import argon2 from "argon2";
import { Hasher } from "@app/authentication/data/protocol/cryptography/hasher";
import { HashVerifier } from "@app/authentication/data/protocol/cryptography/hash-verifier";

export class HasherArgon2Adapter implements Hasher, HashVerifier {
    public constructor(private readonly type: argon2.Options["type"] = argon2.argon2id) {
        this.type = type;
    }

    public hash(value: string): Promise<string> {
        return argon2.hash(value, {
            type: this.type,
        });
    }

    public verify(hash: string, plain: string): Promise<boolean> {
        return argon2.verify(hash, plain, {
            type: this.type,
        });
    }

}
