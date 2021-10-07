import argon2 from "argon2";
import sinon from "sinon";
import faker from "faker";
import { HasherArgon2Adapter } from "@app/authentication/infrastructure/hashing/hasher-argon2-adapter";

const FAKE_HASHED_VALUE = faker.internet.password();
const ARGON2_TYPE = argon2.argon2id;

const makeSut = (): HasherArgon2Adapter => new HasherArgon2Adapter();

describe("HasherArgon2Adapter", () => {
    let hashStub: sinon.SinonStub<[
        plain: Buffer | string,
        options?: (argon2.Options & { raw?: false | undefined; }) | undefined
    ], Promise<string>>;

    let verifyStub: sinon.SinonStub<[
        hash: string,
        plain: Buffer | string,
        options?: argon2.Options | undefined
    ], Promise<boolean>>;

    beforeEach(() => {
        hashStub = sinon.stub(argon2, "hash").onFirstCall().resolves(FAKE_HASHED_VALUE);
        verifyStub = sinon.stub(argon2, "verify").onFirstCall().resolves(true);
    });

    afterEach(() => {
        hashStub.restore();
        verifyStub.restore();
    });

    it("Should call argon2 hash with correct values", async () => {
        const sut = makeSut();
        const password = faker.internet.password();

        await sut.hash(password);

        sinon.assert.calledOnceWithExactly(
            hashStub,
            password,
            { type: ARGON2_TYPE },
        );
    });

    it("Should call argon2 verify with correct values", async () => {
        const sut = makeSut();
        const hash = faker.internet.password();
        const plain = faker.internet.password();

        await sut.verify(hash, plain);

        sinon.assert.calledOnceWithExactly(
            verifyStub,
            hash,
            plain,
            { type: ARGON2_TYPE },
        );
    });

    it("Should return a hash on success", async () => {
        const sut = makeSut();
        await expect(
            sut.hash(faker.internet.password()),
        ).to.eventually.be.equal(FAKE_HASHED_VALUE);
    });

    it("Should return true for verify on success", async () => {
        const sut = makeSut();
        const hash = faker.internet.password();
        const plain = faker.internet.password();

        const result = await sut.verify(hash, plain);

        expect(result).to.be.true;
    });

    it("Should return false for verify on fail", async () => {
        verifyStub.onFirstCall().resolves(false);
        const sut = makeSut();
        const hash = faker.internet.password();
        const plain = faker.internet.password();

        const result = await sut.verify(hash, plain);

        expect(result).to.be.false;
    });

    it("Should throw if argon2 hash throws", async () => {
        hashStub.onFirstCall().rejects();
        const sut = makeSut();

        await expect(
            sut.hash(faker.internet.password()),
        ).to.eventually.be.rejected;
    });

    it("Should throw if argon2 verify throws", async () => {
        verifyStub.onFirstCall().rejects();
        const sut = makeSut();

        await expect(
            sut.verify(faker.internet.password(), faker.internet.password()),
        ).to.eventually.be.rejected;
    });
});
