import sinon from "sinon";
import faker from "faker";
import { LogoutController } from "@app/presentation/authentication/controller/logout-controller";
import { LoadAccountById } from "@app/domain/authentication/use-case/load-account-by-id";

const makeLoadAccountById = (): LoadAccountById => {
    class LoadAccountByIdStub implements LoadAccountById {
        public async execute(): Promise<LoadAccountById.Output> {
            return {
                id: faker.datatype.uuid(),
                name: faker.name.firstName(),
                password: faker.internet.password(),
                email: faker.internet.email(),
            };
        }
    }

    return new LoadAccountByIdStub();
};


const makeSut = (): {
    sut: LogoutController
    loadAccountByIdStub: LoadAccountById
} => {
    const loadAccountByIdStub = makeLoadAccountById();
    return {
        sut: new LogoutController(loadAccountByIdStub),
        loadAccountByIdStub,
    };
};

describe.only("LogoutController", () => {
    it("Should call LoadAccountById with correct value", async () => {
        const { sut, loadAccountByIdStub } = makeSut();
        const executeSpy = sinon.spy(loadAccountByIdStub, "execute");
        const accountId = faker.datatype.uuid();

        await sut.handle({
            data: { accountId },
        });

        sinon.assert.calledOnceWithExactly(executeSpy, { id: accountId });
    });
});
