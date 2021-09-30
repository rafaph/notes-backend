import argon2 from "argon2";
import sinon from "sinon";
import faker from "faker";
import { HasherArgon2Adapter } from "@app/authentication/infrastructure/hashing/hasher-argon2-adapter";

const FAKE_HASHED_VALUE = faker.internet.password();
const ARGON2_TYPE = argon2.argon2id;

const makeSut = (): HasherArgon2Adapter => new HasherArgon2Adapter(ARGON2_TYPE);

describe("HasherArgon2Adapter", () => {
    let hashStub: sinon.SinonStub<[
        plain: Buffer | string,
        options?: (argon2.Options & { raw?: false | undefined; }) | undefined
    ], Promise<string>>;

    beforeEach(() => {
        hashStub = sinon.stub(argon2, "hash").onFirstCall().resolves(FAKE_HASHED_VALUE);
    });

    afterEach(() => {
        hashStub.restore();
    });

    it("Should call argon2 with correct values", async () => {
        const sut = makeSut();
        const password = faker.internet.password();

        await sut.hash(password);

        sinon.assert.calledOnceWithExactly(
            hashStub,
            password,
            { type: ARGON2_TYPE },
        );
    });

    it("Should return a hash on success", async () => {
        const sut = makeSut();
        await expect(
            sut.hash(faker.internet.password()),
        ).to.eventually.be.equal(FAKE_HASHED_VALUE);
    });

    it("Should throw if argon2 throws", async () => {
        hashStub.onFirstCall().rejects();
        const sut = makeSut();

        await expect(
            sut.hash(faker.internet.password()),
        ).to.eventually.be.rejected;
    });
});
