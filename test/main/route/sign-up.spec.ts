import request from "supertest";
import faker from "faker";
import { TestApplication } from "@test/helper/test-application";


describe.skip("@integration SignUp Routes", () => {

    let testApplication: TestApplication;

    before(async () => {
        testApplication = new TestApplication();

        await testApplication.setUp();
    });

    beforeEach(async () => {
        await testApplication.truncateDatabase();
    });

    after(async () => {
        await testApplication.cleanUp();
    });

    it("Should return an account on success", async () => {
        const route = "/api/sign-up";
        const password = faker.internet.password();

        await request(testApplication.baseUrl)
            .post(route)
            .send({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password,
                passwordConfirmation: password
            })
            .expect(200);
    });
});
