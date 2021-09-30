import argon2 from "argon2";
import { Hasher } from "@app/authentication/data/protocol/hasher";

export class HasherArgon2Adapter implements Hasher {
    public constructor(private readonly type?: argon2.Options["type"]) {
        this.type = type;
    }

    public hash(value: string): Promise<string> {
        return argon2.hash(value, {
            type: this.type,
        });
    }

}
