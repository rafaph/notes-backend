import faker from "faker";
import sinon from "sinon";
import { Hasher } from "@app/data/authentication/protocol/cryptography/hasher";
import { AddAccountRepository } from "@app/data/authentication/protocol/persistence/add-account-repository";
import { AddAccount } from "@app/domain/authentication/use-case/add-account";
import { DatabaseAddAccount } from "@app/data/authentication/use-case/database-add-account";
import { LoadAccountByEmailRepository } from "@app/data/authentication/protocol/persistence/load-account-by-email-repository";

const FAKE_HASHED_PASSWORD = faker.internet.password();
const FAKE_ACCOUNT_MODEL_ID = faker.datatype.uuid();

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        public async hash(): Promise<string> {
            return FAKE_HASHED_PASSWORD;
        }
    }

    return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        public async add(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output> {
            return {
                ...input,
                id: FAKE_ACCOUNT_MODEL_ID,
            };
        }
    }

    return new AddAccountRepositoryStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        public async loadByEmail(): Promise<LoadAccountByEmailRepository.Output> {
            return null;
        }
    }

    return new LoadAccountByEmailRepositoryStub();
};

const makeInput = (input: Partial<AddAccount.Input> = {}): AddAccount.Input => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

const makeSut = (): {
    hasherStub: Hasher;
    sut: DatabaseAddAccount;
    addAccountRepositoryStub: AddAccountRepository;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
} => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const hasherStub = makeHasher();
    const addAccountRepositoryStub = makeAddAccountRepository();
    return {
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
        sut: new DatabaseAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub),
    };
};

describe("DatabaseAddAccount", () => {
    it("Should call Hasher with correct password", async () => {
        const { sut, hasherStub } = makeSut();
        const input = makeInput();
        const hashStub = sinon.spy(hasherStub, "hash");

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(hashStub, input.password);
    });

    it("Should throw if Hasher throws", async () => {
        const { sut, hasherStub } = makeSut();
        const input = makeInput();
        sinon.stub(hasherStub, "hash").rejects();

        await expect(sut.execute(input)).to.eventually.be.rejected;
    });

    it("Should call AddAccountRepository with correct values", async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const input = makeInput();

        const addSpy = sinon.spy(addAccountRepositoryStub, "add");

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(addSpy, {
            name: input.name,
            email: input.email,
            password: FAKE_HASHED_PASSWORD,
        });
    });

    it("Should throw if AddAccountRepository throws", async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const input = makeInput();
        sinon.stub(addAccountRepositoryStub, "add").rejects();

        await expect(sut.execute(input)).to.eventually.be.rejected;
    });

    it("Should return an account on success", async () => {
        const { sut } = makeSut();
        const input = makeInput();

        await expect(sut.execute(input)).to.eventually.be.deep.equal({
            ...input,
            id: FAKE_ACCOUNT_MODEL_ID,
            password: FAKE_HASHED_PASSWORD,
        });
    });

    it("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadByEmailSpy = sinon.spy(loadAccountByEmailRepositoryStub, "loadByEmail");
        const email = faker.internet.email();

        await sut.execute(makeInput({ email }));

        sinon.assert.calledOnceWithExactly(loadByEmailSpy, email);
    });

    it("Should return null if LoadAccountByEmailRepository returns an account", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        sinon.stub(loadAccountByEmailRepositoryStub, "loadByEmail").resolves({
            id: faker.datatype.uuid(),
            email: faker.internet.email(),
            name: faker.name.firstName(),
            password: faker.internet.password(),
        });

        const account = await sut.execute(makeInput());

        expect(account).to.be.null;
    });
});
