import "reflect-metadata";
import "@test/setup-env";

import "@app/domains/di";
import "@app/application/di";

import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromise);
chai.use(sinonChai);
