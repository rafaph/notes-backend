import faker from "faker";
import sinon from "sinon";
import { DatabaseLoadAccountByToken } from "@app/data/authentication/use-case/database-load-account-by-token";
import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { Decrypter } from "@app/data/authentication/protocol/cryptography/decrypter";
import { LoadAccountByTokenRepository } from "@app/data/authentication/protocol/persistence/load-account-by-token-repository";

const FAKE_ACCOUNT_ID = faker.datatype.uuid();
const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        public async decrypt(): Promise<unknown> {
            return {
                id: FAKE_ACCOUNT_ID,
            };
        }
    }

    return new DecrypterStub();
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        public async loadByToken(): Promise<LoadAccountByTokenRepository.Output> {
            return {
                id: FAKE_ACCOUNT_ID,
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            };
        }
    }

    return new LoadAccountByTokenRepositoryStub();
};

const makeInput = (accessToken = faker.datatype.uuid()): LoadAccountByToken.Input => {
    return {
        accessToken,
    };
};

const makeSut = (): {
    sut: DatabaseLoadAccountByToken;
    decrypterStub: Decrypter;
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
} => {
    const decrypterStub = makeDecrypterStub();
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
    return {
        sut: new DatabaseLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub),
        decrypterStub,
        loadAccountByTokenRepositoryStub
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

    it("Should throw if Decrypter throws", async () => {
        const { sut, decrypterStub } = makeSut();
        sinon.stub(decrypterStub, "decrypt").rejects();

        const input = makeInput();
        await expect(sut.execute(input)).to.eventually.be.rejected;
    });

    it("Should returns undefined if Decrypter returns undefined", async () => {
        const { sut, decrypterStub } = makeSut();
        sinon.stub(decrypterStub, "decrypt").resolves(undefined);

        const input = makeInput();
        await expect(sut.execute(input)).to.eventually.be.undefined;
    });

    it("Should call LoadAccountByTokenRepository with correct value", async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();
        const loadByTokenSpy = sinon.spy(loadAccountByTokenRepositoryStub, "loadByToken");

        const input = makeInput();
        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(loadByTokenSpy, input.accessToken);
    });

    it("Should throw if LoadAccountByTokenRepository throws", async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();
        sinon.stub(loadAccountByTokenRepositoryStub, "loadByToken").rejects();

        const input = makeInput();
        await expect(sut.execute(input)).to.eventually.be.rejected;
    });
});
