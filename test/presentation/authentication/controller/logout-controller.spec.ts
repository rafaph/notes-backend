import sinon from "sinon";
import faker from "faker";
import { LogoutController } from "@app/presentation/authentication/controller/logout-controller";
import { Deauthenticate } from "@app/domain/authentication/use-case/deauthenticate";

const makeDeauthenticate = (): Deauthenticate => {
    class DeauthenticateStub implements Deauthenticate {
        public async execute(): Promise<Deauthenticate.Output> {
            return undefined;
        }
    }

    return new DeauthenticateStub();
};


const makeSut = (): {
    sut: LogoutController
    deauthenticateStub: Deauthenticate
} => {
    const deauthenticateStub = makeDeauthenticate();
    return {
        sut: new LogoutController(deauthenticateStub),
        deauthenticateStub,
    };
};

describe.only("LogoutController", () => {
    it("Should call LoadAccountById with correct value", async () => {
        const { sut, deauthenticateStub } = makeSut();
        const executeSpy = sinon.spy(deauthenticateStub, "execute");
        const accountId = faker.datatype.uuid();

        await sut.handle({
            data: { accountId },
        });

        sinon.assert.calledOnceWithExactly(executeSpy, { id: accountId });
    });
});
