import faker from "faker";
import sinon from "sinon";
import { DatabaseAuthenticate } from "@app/authentication/data/use-case/database-authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/persistence/load-account-by-email-repository";
import { Authenticate } from "@app/authentication/domain/use-case/authenticate";

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        public async execute(input: LoadAccountByEmailRepository.Input): Promise<LoadAccountByEmailRepository.Output> {
            return {
                email: input.email,
                password: faker.internet.password(),
                name: faker.name.findName(),
                id: faker.datatype.uuid(),
            };
        }
    }

    return new LoadAccountByEmailRepositoryStub();
};

const makeSutInput = (input: Partial<Authenticate.Input> = {}): Authenticate.Input => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

const makeSut = (): {
    sut: DatabaseAuthenticate
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
} => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    return {
        sut: new DatabaseAuthenticate(loadAccountByEmailRepositoryStub),
        loadAccountByEmailRepositoryStub,
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
});
