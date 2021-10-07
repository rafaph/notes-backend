import faker from "faker";
import sinon from "sinon";
import { DatabaseAuthenticate } from "@app/authentication/data/use-case/database-authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/load-account-by-email-repository";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { Hasher } from "@app/authentication/data/protocol/cryptography/hasher";
import { TokenGenerator } from "@app/authentication/data/protocol/cryptography/token-generator";
import { UpdateAccessTokenRepository } from "@app/authentication/data/protocol/persistence/update-access-token-repository";

const FAKE_PASSWORD = faker.internet.password();
const FAKE_ID = faker.datatype.uuid();

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        public async execute(input: LoadAccountByEmailRepository.Input): Promise<LoadAccountByEmailRepository.Output> {
            return {
                email: input.email,
                password: FAKE_PASSWORD,
                name: faker.name.findName(),
                id: FAKE_ID,
            };
        }
    }

    return new LoadAccountByEmailRepositoryStub();
};

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        public hash(): Promise<string> {
            throw new Error("Not implemented.");
        }

        public async verify(): Promise<boolean> {
            return true;
        }
    }

    return new HasherStub();
};

const FAKE_TOKEN = faker.datatype.uuid();

const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        public async generate(): Promise<string> {
            return FAKE_TOKEN;
        }
    }

    return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        public async execute(): Promise<void> {
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
    hasherStub: Hasher,
    tokenGeneratorStub: TokenGenerator,
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
} => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const hasherStub = makeHasher();
    const tokenGeneratorStub = makeTokenGenerator();
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
    return {
        sut: new DatabaseAuthenticate(loadAccountByEmailRepositoryStub, hasherStub, tokenGeneratorStub, updateAccessTokenRepositoryStub),
        loadAccountByEmailRepositoryStub,
        hasherStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub,
    };
};

describe("DatabaseAuthenticate", () => {
    it("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const executeSpy = sinon.spy(loadAccountByEmailRepositoryStub, "execute");
        const email = faker.internet.email();
        await sut.execute(makeSutInput({ email }));

        sinon.assert.calledOnceWithExactly(executeSpy, { email });
    });

    it("Should throw if LoadAccountByEmailRepository throws", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        sinon.stub(loadAccountByEmailRepositoryStub, "execute").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });

    it("Should return undefined if LoadAccountByEmailRepository returns undefined", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        sinon.stub(loadAccountByEmailRepositoryStub, "execute").resolves();

        const token = await sut.execute(makeSutInput());

        expect(token).to.be.undefined;
    });

    it("Should call Hasher verify with correct password", async () => {
        const { sut, hasherStub } = makeSut();
        const verifySpy = sinon.spy(hasherStub, "verify");
        const input = makeSutInput();

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(verifySpy, FAKE_PASSWORD, input.password);
    });

    it("Should throw if Hasher verify throws", async () => {
        const { sut, hasherStub } = makeSut();
        sinon.stub(hasherStub, "verify").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });

    it("Should return undefined if Hasher verify returns false", async () => {
        const { sut, hasherStub } = makeSut();
        sinon.stub(hasherStub, "verify").resolves(false);

        const token = await sut.execute(makeSutInput());

        expect(token).to.be.undefined;
    });

    it("Should call TokenGenerator with correct id", async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        const generateSpy = sinon.spy(tokenGeneratorStub, "generate");

        await sut.execute(makeSutInput());

        sinon.assert.calledOnceWithExactly(generateSpy, FAKE_ID);
    });

    it("Should throw if TokenGenerator throws", async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        sinon.stub(tokenGeneratorStub, "generate").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });

    it("Should return a valid token when authenticate", async () => {
        const { sut } = makeSut();

        await expect(sut.execute(makeSutInput())).to.eventually.be.equal(FAKE_TOKEN);
    });

    it("Should call UpdateAccessTokenRepository with correct values", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        const updateSpy = sinon.spy(updateAccessTokenRepositoryStub, "execute");

        await sut.execute(makeSutInput());

        sinon.assert.calledOnceWithExactly(updateSpy, FAKE_ID, FAKE_TOKEN);
    });

    it("Should throw if UpdateAccessTokenRepository throws", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        sinon.stub(updateAccessTokenRepositoryStub, "execute").rejects();

        await expect(sut.execute(makeSutInput())).to.eventually.be.rejected;
    });
});
