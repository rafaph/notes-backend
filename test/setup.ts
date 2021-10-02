import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import chaiDateTime from "chai-datetime";
import { TestApplication } from "@test/helper/test-application";

chai.config.truncateThreshold = 1;
chai.config.showDiff = true;

chai.use(chaiAsPromise);
chai.use(chaiDateTime);

export async function mochaGlobalSetup(): Promise<void> {
    await TestApplication.setup();
}

export async function mochaGlobalTeardown(): Promise<void> {
    await TestApplication.tearDown();
}

export const mochaHooks = {
    async beforeEach(): Promise<void> {
        await TestApplication.truncateDatabase();
    },
};
