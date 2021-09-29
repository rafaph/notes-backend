import argon2 from "argon2";
import { EncrypterArgon2Adapter } from "@app/authentication/infrastructure/hashing/encrypter-argon2-adapter";
import sinon from "sinon";
import faker from "faker";

const FAKE_ENCRYPTED_PASSWORD = faker.internet.password();

describe("EncrypterArgon2Adapter", () => {
    let hashStub: sinon.SinonStub<[
        plain: Buffer | string,
        options?: (argon2.Options & { raw?: false | undefined; }) | undefined
    ], Promise<string>>;

    beforeEach(() => {
        hashStub = sinon.stub(argon2, "hash").onFirstCall().resolves(FAKE_ENCRYPTED_PASSWORD);
    });

    afterEach(() => {
        hashStub.restore();
    });

    it("Should call argon2 with correct values", async () => {
        const type = argon2.argon2id;
        const sut = new EncrypterArgon2Adapter(type);
        const password = faker.internet.password();
        await sut.encrypt(password);

        sinon.assert.calledOnceWithExactly(hashStub, password, { type });
    });
});
