import { Sequelize } from "sequelize";
import faker from "faker";
import { SequelizeAccountRepository } from "@app/authentication/infrastructure/database/sequelize/sequelize-account-repository";
import { SequelizeClient } from "@app/shared/infrastructure/sequelize-client";
import {
    AccountFactory,
    SequelizeAccount,
} from "@app/authentication/infrastructure/database/sequelize/model/account";
import { expect } from "chai";

const makeSut = (sequelize: Sequelize): SequelizeAccountRepository => (
    new SequelizeAccountRepository(sequelize)
);

describe("@integration SequelizeAccountRepository", () => {
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
        const fakeAccount = await sequelizeAccount.create({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });

        const sut = makeSut(sequelize);

        const account = await sut.loadByEmail(fakeAccount.email);

        expect(account).to.not.be.undefined;
        expect(account?.id).to.be.equal(fakeAccount.id);
        expect(account?.name).to.be.equal(fakeAccount.name);
        expect(account?.email).to.be.equal(fakeAccount.email);
        expect(account?.password).to.be.equal(fakeAccount.password);
    });

    it("Should return undefined if loadByEmail fails", async () => {
        const sut = makeSut(sequelize);

        const account = await sut.loadByEmail(faker.internet.email());

        expect(account).to.be.undefined;
    });

    it("Should update the account accessToken on updateAccessToken success", async () => {
        const sut = makeSut(sequelize);
        const fakeAccount = await sequelizeAccount.create({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });
        const accessToken = faker.datatype.uuid();

        expect(fakeAccount.accessToken).to.be.null;

        await sut.updateAccessToken({
            id: fakeAccount.id,
            accessToken,
        });

        const account = await sequelizeAccount.findByPk(fakeAccount.id);
        expect(account).to.not.be.null;
        expect(account?.accessToken).to.be.equal(accessToken);
    });
});
