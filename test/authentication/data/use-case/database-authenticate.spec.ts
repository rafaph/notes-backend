import faker from "faker";
import sinon from "sinon";
import { DatabaseAuthenticate } from "@app/authentication/data/use-case/database-authenticate";
import { LoadAccountByEmailRepository } from "@app/authentication/data/protocol/load-account-by-email-repository";

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
        await sut.execute({
            email,
            password: faker.internet.password(),
        });

        sinon.assert.calledOnceWithExactly(executeSpy, { email });
    });
});
