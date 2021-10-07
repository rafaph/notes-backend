import faker from "faker";
import sinon from "sinon";
import { DatabaseAuthenticate } from "@app/authentication/data/use-case/database-authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/load-account-by-email-repository";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";
import { Hasher } from "@app/authentication/data/protocol/cryptography/hasher";

const FAKE_PASSWORD = faker.internet.password();

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        public async execute(input: LoadAccountByEmailRepository.Input): Promise<LoadAccountByEmailRepository.Output> {
            return {
                email: input.email,
                password: FAKE_PASSWORD,
                name: faker.name.findName(),
                id: faker.datatype.uuid(),
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

const makeSutInput = (input: Partial<Authenticate.Input> = {}): Authenticate.Input => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

const makeSut = (): {
    sut: DatabaseAuthenticate
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hasherStub: Hasher,
} => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const hasherStub = makeHasher();
    return {
        sut: new DatabaseAuthenticate(loadAccountByEmailRepositoryStub, hasherStub),
        loadAccountByEmailRepositoryStub,
        hasherStub,
    };
};

describe.only("DatabaseAuthenticate", () => {
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

    it("Should call Hasher with correct password", async () => {
        const { sut, hasherStub } = makeSut();
        const verifySpy = sinon.spy(hasherStub, "verify");
        const input = makeSutInput();

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(verifySpy, FAKE_PASSWORD, input.password);
    });
});