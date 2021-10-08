import { Sequelize } from "sequelize";
import faker from "faker";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-account-repository";
import { AddAccountRepository } from "@app/authentication/data/protocol/persistence/add-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";

const makeSut = (sequelize: Sequelize): SequelizeAccountRepository => (
    new SequelizeAccountRepository(sequelize)
);

const makeInput = (input: Partial<AddAccountRepository.Input> = {}): AddAccountRepository.Input => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

describe("SequelizeAddAccountRepository", () => {
    let sequelize: Sequelize;

    before(() => {
        sequelize = SequelizeClient.getClient();
    });

    it("Should return an account on success", async () => {
        const sut = makeSut(sequelize);
        const input = makeInput();

        const account = await sut.add(input);

        expect(account.id).to.not.be.undefined;
        expect(account.name).to.be.equal(input.name);
        expect(account.email).to.be.equal(input.email);
        expect(account.password).to.be.equal(input.password);
    });
});
