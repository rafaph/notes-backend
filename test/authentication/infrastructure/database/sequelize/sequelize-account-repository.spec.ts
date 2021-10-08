import { Sequelize } from "sequelize";
import faker from "faker";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import { AccountFactory, SequelizeAccount } from "@app/authentication/infrastructure/database/sequelize/model/account";

const makeSut = (sequelize: Sequelize): SequelizeAccountRepository => (
    new SequelizeAccountRepository(sequelize)
);

describe.only("SequelizeAccountRepository", () => {
    let sequelize: Sequelize;
    let sequelizeAccount: SequelizeAccount;

    before(async () => {
        sequelize = SequelizeClient.getClient();
        sequelizeAccount = AccountFactory(sequelize);
    });

    it("Should return an account on success", async () => {
        const sut = makeSut(sequelize);
        const input = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        const account = await sut.add(input);

        expect(account.id).to.not.be.undefined;
        expect(account.name).to.be.equal(input.name);
        expect(account.email).to.be.equal(input.email);
        expect(account.password).to.be.equal(input.password);
    });

    it("Should return a account on loadByEmail success", async () => {
        const createdAccount = await sequelizeAccount.create({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });

        const sut = makeSut(sequelize);

        const account = await sut.loadByEmail({
            email: createdAccount.email,
        });

        expect(account).to.not.be.undefined;
        expect(account?.id).to.be.equal(createdAccount.id);
        expect(account?.name).to.be.equal(createdAccount.name);
        expect(account?.email).to.be.equal(createdAccount.email);
        expect(account?.password).to.be.equal(createdAccount.password);
    });
});
