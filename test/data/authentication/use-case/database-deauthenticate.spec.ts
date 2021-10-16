import sinon from "sinon";
import faker from "faker";
import { LoadAccountByIdRepository } from "@app/data/authentication/protocol/persistence/load-account-by-id-repository";
import { DatabaseDeauthenticate } from "@app/data/authentication/use-case/database-deauthenticate";
import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";
import { UpdateAccessTokenRepository } from "@app/data/authentication/protocol/persistence/update-access-token-repository";

const FAKE_ACCOUNT_ID = faker.datatype.uuid();
const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
    class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
        public async loadById(): Promise<LoadAccountByIdRepository.Output> {
            return {
                id: FAKE_ACCOUNT_ID,
                name: faker.name.firstName(),
                password: faker.internet.password(),
                email: faker.internet.email(),
            };
        }
    }

    return new LoadAccountByIdRepositoryStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        public async updateAccessToken(): Promise<UpdateAccessTokenRepository.Output> {
            return undefined;
        }
    }

    return new UpdateAccessTokenRepositoryStub();
};

const makeSut = (): {
    sut: DatabaseDeauthenticate
    loadAccountByIdRepositoryStub: LoadAccountByIdRepository
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
} => {
    const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository();
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
    return {
        sut: new DatabaseDeauthenticate(loadAccountByIdRepositoryStub, updateAccessTokenRepositoryStub),
        loadAccountByIdRepositoryStub,
        updateAccessTokenRepositoryStub,
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

    it("Should throw if LoadAccountByIdRepository throws", async () => {
        const { sut, loadAccountByIdRepositoryStub } = makeSut();
        sinon.stub(loadAccountByIdRepositoryStub, "loadById").rejects();
        const input = makeInput();

        await expect(sut.execute(input)).to.eventually.be.rejected;
    });

    it("Should call UpdateAccessTokenRepository with correct values", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        const updateAccessTokenSpy = sinon.spy(updateAccessTokenRepositoryStub, "updateAccessToken");
        const input = makeInput();

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(updateAccessTokenSpy, {
            id: FAKE_ACCOUNT_ID,
            accessToken: null,
        });
    });

    it("Should throw if UpdateAccessTokenRepository throws", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        sinon.stub(updateAccessTokenRepositoryStub, "updateAccessToken").rejects();
        const input = makeInput();

        await expect(sut.execute(input)).to.eventually.be.rejected;
    });
});
