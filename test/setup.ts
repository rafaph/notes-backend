import "reflect-metadata";
import "@test/setup-env";

import "@app/domains/di";
import "@app/application/di";

import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import sinonChai from "sinon-chai";
import * as dbHelpers from "@test/helpers/database";

chai.use(chaiAsPromise);
chai.use(sinonChai);

function isIntegrationTests(): boolean {
    return process.argv.length === 2 || (process.argv.includes("@integration") && !process.argv.includes("--invert"));
}

export async function mochaGlobalSetup(): Promise<void> {
    if (isIntegrationTests()) {
        await dbHelpers.beforeTests();
    }
}

export async function mochaGlobalTeardown(): Promise<void> {
    if (isIntegrationTests()) {
        await dbHelpers.afterTests();
    }
}
