import "reflect-metadata";
import sinon from "sinon";
import { Connection, Repository } from "typeorm";
import { container } from "tsyringe";

import "@test/setup-env";

container.registerInstance("DbConnection", {
    getRepository: sinon.stub().returns(new Repository()),
} as unknown as Connection);

import "@app/domains/di";
import "@app/application/di";

import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromise);
chai.use(sinonChai);
