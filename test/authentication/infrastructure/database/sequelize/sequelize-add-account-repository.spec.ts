import { Sequelize } from "sequelize";
import faker from "faker";
import { SequelizeAddAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-add-account-repository";
import { TestDatabase } from "@test/helper/test-database";
import { AddAccountRepository } from "@app/authentication/data/protocol/add-account-repository";

const makeSut = (sequelize: Sequelize): SequelizeAddAccountRepository => (
    new SequelizeAddAccountRepository(sequelize)
);

const makeInput = (input: Partial<AddAccountRepository.Input> = {}): AddAccountRepository.Input => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

describe.skip("SequelizeAddAccountRepository", () => {
    it("Should return an account on success", async () => {
        await new TestDatabase().run(async (sequelize) => {
            const sut = makeSut(sequelize);
            const input = makeInput();

            const account = await sut.execute(input);

            expect(account.id).to.not.be.undefined;
            expect(account.name).to.be.equal(input.name);
            expect(account.email).to.be.equal(input.email);
            expect(account.password).to.be.equal(input.password);
        });
    });
});
