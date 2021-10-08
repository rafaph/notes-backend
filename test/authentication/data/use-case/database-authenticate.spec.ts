import faker from "faker";
import sinon from "sinon";
import { DatabaseAuthenticate } from "@app/authentication/data/use-case/database-authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/account/load-account-by-email-repository";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { Encrypter } from "@app/authentication/data/protocol/cryptography/encrypter";
import { UpdateAccessTokenRepository } from "@app/authentication/data/protocol/persistence/account/update-access-token-repository";
import { HashVerifier } from "@app/authentication/data/protocol/cryptography/hash-verifier";

const FAKE_PASSWORD = faker.internet.password();
const FAKE_ID = faker.datatype.uuid();

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        public async loadByEmail(email: LoadAccountByEmailRepository.Input): Promise<LoadAccountByEmailRepository.Output> {
            return {
                email,
                password: FAKE_PASSWORD,
                name: faker.name.findName(),
                id: FAKE_ID,
            };
        }
    }

    return new LoadAccountByEmailRepositoryStub();
};

const makeHashVerifier = (): HashVerifier => {
    class HashVerifierStub implements HashVerifier {
        public hash(): Promise<string> {
            throw new Error("Not implemented.");
        }

        public async verify(): Promise<boolean> {
            return true;
        }
    }

    return new HashVerifierStub();
};

const FAKE_TOKEN = faker.datatype.uuid();

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        public async encrypt(): Promise<string> {
            return FAKE_TOKEN;
        }
    }

    return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        public async updateAccessToken(): Promise<UpdateAccessTokenRepository.Output> {
            return undefined;
        }
    }

    return new UpdateAccessTokenRepositoryStub();
};

const makeSutInput = (input: Partial<Authenticate.Input> = {}): Authenticate.Input => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

const makeSut = (): {
    sut: DatabaseAuthenticate
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashVerifierStub: HashVerifier,
    encrypter: Encrypter,
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
} => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const hashVerifierStub = makeHashVerifier();
    const encrypter = makeEncrypter();
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
    return {
        sut: new DatabaseAuthenticate(loadAccountByEmailRepositoryStub, hashVerifierStub, encrypter, updateAccessTokenRepositoryStub),
        loadAccountByEmailRepositoryStub,
        hashVerifierStub,
        encrypter,
        updateAccessTokenRepositoryStub,
    };
};

describe("DatabaseAuthenticate", () => {
    it("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const executeSpy = sinon.spy(loadAccountByEmailRepositoryStub, "loadByEmail");
        const email = faker.internet.email();
        await sut.execute(makeSutInput({ email }));

        sinon.assert.calledOnceWithExactly(executeSpy, email);
    });

    it("Should throw if LoadAccountByEmailRepository throws", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        sinon.stub(loadAccountByEmailRepositoryStub, "loadByEmail").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });

    it("Should return undefined if LoadAccountByEmailRepository returns undefined", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        sinon.stub(loadAccountByEmailRepositoryStub, "loadByEmail").resolves();

        const token = await sut.execute(makeSutInput());

        expect(token).to.be.undefined;
    });

    it("Should call HasherVerifier with correct password", async () => {
        const { sut, hashVerifierStub } = makeSut();
        const verifySpy = sinon.spy(hashVerifierStub, "verify");
        const input = makeSutInput();

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(verifySpy, FAKE_PASSWORD, input.password);
    });

    it("Should throw if HasherVerifier throws", async () => {
        const { sut, hashVerifierStub } = makeSut();
        sinon.stub(hashVerifierStub, "verify").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });

    it("Should return undefined if HasherVerifier returns false", async () => {
        const { sut, hashVerifierStub } = makeSut();
        sinon.stub(hashVerifierStub, "verify").resolves(false);

        const token = await sut.execute(makeSutInput());

        expect(token).to.be.undefined;
    });

    it("Should call Encrypter with correct id", async () => {
        const { sut, encrypter } = makeSut();
        const encryptSpy = sinon.spy(encrypter, "encrypt");

        await sut.execute(makeSutInput());

        sinon.assert.calledOnceWithExactly(encryptSpy, FAKE_ID);
    });

    it("Should throw if Encrypter throws", async () => {
        const { sut, encrypter } = makeSut();
        sinon.stub(encrypter, "encrypt").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });

    it("Should return a valid token when authenticate", async () => {
        const { sut } = makeSut();

        await expect(sut.execute(makeSutInput())).to.eventually.be.equal(FAKE_TOKEN);
    });

    it("Should call UpdateAccessTokenRepository with correct values", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        const updateSpy = sinon.spy(updateAccessTokenRepositoryStub, "updateAccessToken");

        await sut.execute(makeSutInput());

        sinon.assert.calledOnceWithExactly(updateSpy, { id: FAKE_ID, accessToken: FAKE_TOKEN });
    });

    it("Should throw if UpdateAccessTokenRepository throws", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        sinon.stub(updateAccessTokenRepositoryStub, "updateAccessToken").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });
});
