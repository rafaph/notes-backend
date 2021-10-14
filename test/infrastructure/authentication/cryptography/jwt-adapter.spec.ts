import jwt from "jsonwebtoken";
import faker from "faker";
import sinon from "sinon";
import { JWTAdapter } from "@app/infrastructure/authentication/cryptography/jwt-adapter";

const FAKE_SECRET = faker.random.word();
const FAKE_SIGNED_VALUE = faker.random.word();

const makeSut = (): JWTAdapter => {
    return new JWTAdapter(FAKE_SECRET);
};

describe("JWTAdapter", () => {
    let signStub: sinon.SinonStub<[payload: Record<string, unknown>, secret: string], string>;

    beforeEach(() => {
        signStub = sinon.stub(jwt, "sign").returns(FAKE_SIGNED_VALUE);
    });

    afterEach(() => {
        signStub.restore();
    });

    it("Should call sign with correct values", async () => {
        const sut = makeSut();
        const value = faker.random.word();
        await sut.encrypt(value);

        sinon.assert.calledOnceWithExactly(signStub, { id: value }, FAKE_SECRET);
    });

    it("Should return a token on sign success", async () => {
        const sut = makeSut();

        await expect(
            sut.encrypt(faker.random.word()),
        ).to.eventually.be.equals(FAKE_SIGNED_VALUE);
    });

    it("Should throw if jwt sign throws", async () => {
        const sut = makeSut();
        signStub.throwsException();

        await expect(
            sut.encrypt(faker.random.word()),
        ).to.eventually.be.rejected;
    });

    it("Should call verify with correct values");
    it("Should return decrypted payload on success");
    it("Should throw if jwt verify throws");
});
