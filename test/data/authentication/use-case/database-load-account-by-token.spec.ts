import faker from "faker";
import sinon from "sinon";
import { DatabaseLoadAccountByToken } from "@app/data/authentication/use-case/database-load-account-by-token";
import { LoadAccountByToken } from "@app/domain/authentication/use-case/load-account-by-token";
import { Decrypter } from "@app/data/authentication/protocol/cryptography/decrypter";
import { LoadAccountByTokenRepository } from "@app/data/authentication/protocol/persistence/load-account-by-token-repository";

const FAKE_ACCOUNT_ID = faker.datatype.uuid();
const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        public async decrypt(): Promise<{ id: string }> {
            return {
                id: FAKE_ACCOUNT_ID,
            };
        }
    }

    return new DecrypterStub();
};

const FAKE_ACCOUNT = {
    id: FAKE_ACCOUNT_ID,
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        public async loadByToken(): Promise<LoadAccountByTokenRepository.Output> {
            return FAKE_ACCOUNT;
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
        loadAccountByTokenRepositoryStub,
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

    it("Should returns null if Decrypter returns null", async () => {
        const { sut, decrypterStub } = makeSut();
        sinon.stub(decrypterStub, "decrypt").resolves(null);

        const input = makeInput();
        await expect(sut.execute(input)).to.eventually.be.null;
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

    it("Should return null if LoadAccountByTokenRepository returns null", async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut();
        sinon.stub(loadAccountByTokenRepositoryStub, "loadByToken").resolves(null);

        const input = makeInput();
        await expect(sut.execute(input)).to.eventually.be.null;
    });

    it("Should return an account on success", async () => {
        const { sut } = makeSut();

        const input = makeInput();
        const account = await sut.execute(input);
        expect(account).to.be.deep.equals(FAKE_ACCOUNT);
    });
});
