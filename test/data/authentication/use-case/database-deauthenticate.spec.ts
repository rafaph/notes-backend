import sinon from "sinon";
import faker from "faker";
import { LoadAccountByIdRepository } from "@app/data/authentication/protocol/persistence/load-account-by-id-repository";
import { DatabaseDeauthenticate } from "@app/data/authentication/use-case/database-deauthenticate";
import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
    class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
        public async loadById(): Promise<LoadAccountByIdRepository.Output> {
            return {
                id: faker.datatype.uuid(),
                name: faker.name.firstName(),
                password: faker.internet.password(),
                email: faker.internet.email(),
            };
        }
    }

    return new LoadAccountByIdRepositoryStub();
};

const makeSut = (): {
    sut: DatabaseDeauthenticate,
    loadAccountByIdRepositoryStub: LoadAccountByIdRepository
} => {
    const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository();
    return {
        sut: new DatabaseDeauthenticate(loadAccountByIdRepositoryStub),
        loadAccountByIdRepositoryStub,
    };
};

const makeInput = (input: Partial<Deauthenticate.Input> = {}): Deauthenticate.Input => {
    return {
        id: faker.datatype.uuid(),
        ...input,
    };
};

describe("DatabaseDeauthenticate", () => {
    it("Should call LoadAccountByIdRepository with correct value", async () => {
        const { sut, loadAccountByIdRepositoryStub } = makeSut();
        const loadByIdSpy = sinon.spy(loadAccountByIdRepositoryStub, "loadById");
        const input = makeInput();

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(loadByIdSpy, input.id);
    });

    it("Should return false if LoadAccountByIdRepository returns null", async () => {
        const { sut, loadAccountByIdRepositoryStub } = makeSut();
        sinon.stub(loadAccountByIdRepositoryStub, "loadById").resolves(null);
        const input = makeInput();

        const deauthenticated = await sut.execute(input);

        expect(deauthenticated).to.be.false;
    });
});
