import argon2 from "argon2";
import { IHashing } from "@app/domains/common/interfaces/hashing";
import { Lifecycle, registry, scoped } from "tsyringe";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "Hashing", useClass: Hashing }])
export class Hashing implements IHashing {
    private readonly type: argon2.Options["type"] = argon2.argon2id;

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
