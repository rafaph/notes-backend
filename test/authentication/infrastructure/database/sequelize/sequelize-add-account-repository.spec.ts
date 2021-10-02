import { Sequelize } from "sequelize";
import faker from "faker";
import { SequelizeAddAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-add-account-repository";
import { AddAccountRepository } from "@app/authentication/data/protocol/add-account-repository";
import { env } from "@app/main/config/env";

const makeSut = (sequelize: Sequelize): SequelizeAddAccountRepository => (
    new SequelizeAddAccountRepository(sequelize)
);

const makeInput = (input: Partial<AddAccountRepository.Input> = {}): AddAccountRepository.Input => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...input,
});

describe("SequelizeAddAccountRepository", () => {
    let sequelize: Sequelize;

    before(async () => {
        sequelize = new Sequelize(env.DATABASE_URL, { logging: false });
    });

    beforeEach(async () => {
        await sequelize.truncate();
    });

    after(async () => {
        await sequelize.close();
    });

    it("Should return an account on success", async () => {
        const sut = makeSut(sequelize);
        const input = makeInput();

        const account = await sut.execute(input);

        expect(account.id).to.not.be.undefined;
        expect(account.name).to.be.equal(input.name);
        expect(account.email).to.be.equal(input.email);
        expect(account.password).to.be.equal(input.password);
    });
});
