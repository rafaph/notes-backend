import faker from "faker";
import sinon from "sinon";
import { DatabaseAddAccount } from "@app/authentication/data/use-case/database-add-account";
import { Encrypter } from "@app/authentication/data/protocol/encrypter";
import { AddAccount } from "@app/authentication/domain/use-case/add-account";

const makeEncrypter = (): Encrypter => {
    class EncryterStub implements Encrypter {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public async encrypt(_value: string): Promise<string> {
            return "encrypted_value";
        }
    }

    return new EncryterStub();
};

const makeInput = (input: Partial<AddAccount.Input> = {}): AddAccount.Input => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

const makeSut = (): {
    encrypter: Encrypter,
    sut: DatabaseAddAccount
} => {
    const encrypter = makeEncrypter();
    return {
        encrypter,
        sut: new DatabaseAddAccount(encrypter),
    };
};

describe("DatabaseAddAccount", () => {
    it("Should call Encrypter with correct password", async () => {
        const { sut, encrypter } = makeSut();
        const input = makeInput();
        const encryptStub = sinon.stub(encrypter, "encrypt");

        await sut.execute(input);

        sinon.assert.calledOnceWithExactly(encryptStub, input.password);
    });

    it("Should throw if Encrypter throws", async () => {
        const { sut, encrypter } = makeSut();
        const input = makeInput();
        sinon.stub(encrypter, "encrypt").rejects();

        await expect(sut.execute(input)).to.be.eventually.rejected;
    });
});
