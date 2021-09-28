import faker from "faker";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter";

describe("SignUpController", () => {
    context("When missing params", () => {
        const keys: SignUpController.RequestBodyKey[] = ["name", "email", "password", "passwordConfirmation"];

        for (const key of keys) {
            it(`Should return a bad request response when no ${key} is provided`, async () => {
                const sut = new SignUpController();
                const password = faker.internet.password();
                const body: SignUpController.RequestBody = {
                    name: faker.name.firstName(),
                    email: faker.internet.email(),
                    password,
                    passwordConfirmation: password,
                    [key]: undefined,
                };
                const response = await sut.handle({ body });

                expect(response.statusCode).to.be.equal(400);
                expect(response.body)
                    .to.be.instanceOf(MissingParameterError)
                    .that.includes({ paramName: key });
            });
        }
    });
});
