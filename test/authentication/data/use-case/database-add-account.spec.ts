import faker from "faker";
import sinon from "sinon";
import { DatabaseAddAccount } from "@app/authentication/data/use-case/database-add-account";
import { Hasher } from "@app/authentication/data/protocol/cryptography/hasher";
import { AddAccount } from "@app/authentication/domain/use-case/add-account";
import { AddAccountRepository } from "@app/authentication/data/protocol/persistence/add-account-repository";

const FAKE_HASHED_PASSWORD = faker.internet.password();
const FAKE_ACCOUNT_MODEL_ID = faker.datatype.uuid();

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        public verify(): Promise<boolean> {
            throw new Error("Not implemented.");
        }

        public async hash(): Promise<string> {
            return FAKE_HASHED_PASSWORD;
        }
    }

    return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        public async execute(input: AddAccountRepository.Input): Promise<AddAccountRepository.Output> {
            return {
                ...input,
                id: FAKE_ACCOUNT_MODEL_ID,
            };
        }
    }

    return new AddAccountRepositoryStub();
};

const makeInput = (input: Partial<AddAccount.Input> = {}): AddAccount.Input => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

const makeSut = (): {
    hasherStub: Hasher,
    sut: DatabaseAddAccount
    addAccountRepositoryStub: AddAccountRepository,
} => {
    const hasherStub = makeHasher();
    const addAccountRepositoryStub = makeAddAccountRepository();
    return {
        hasherStub,
        addAccountRepositoryStub,
        sut: new DatabaseAddAccount(hasherStub, addAccountRepositoryStub),
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

        const addSpy = sinon.spy(addAccountRepositoryStub, "execute");

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
        sinon.stub(addAccountRepositoryStub, "execute").rejects();

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
});
