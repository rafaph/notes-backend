import faker from "faker";
import { DatabaseLoadAccountByToken } from "@app/data/authentication/use-case/database-load-account-by-token";
import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { Decrypter } from "@app/data/authentication/protocol/cryptography/decrypter";
import sinon from "sinon";

const FAKE_ACCOUNT_ID = faker.datatype.uuid();
const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        public async decrypt(): Promise<Record<string, unknown>> {
            return {
                id: FAKE_ACCOUNT_ID,
            };
        }
    }

    return new DecrypterStub();
};

const makeInput = (accessToken = faker.datatype.uuid()): LoadAccountByToken.Input => {
    return {
        accessToken,
    };
};

const makeSut = (): {
    sut: DatabaseLoadAccountByToken;
    decrypterStub: Decrypter;
} => {
    const decrypterStub = makeDecrypterStub();
    return {
        sut: new DatabaseLoadAccountByToken(decrypterStub),
        decrypterStub,
    };
};

describe("DatabaseLoadAccountByToken", () => {
    it("Should call Decrypter with correct value", async () => {
        const { sut, decrypterStub } = makeSut();
        const decryptSpy = sinon.spy(decrypterStub, "decrypt");

        const input = makeInput();
        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(decryptSpy, input.accessToken);
    });
});
