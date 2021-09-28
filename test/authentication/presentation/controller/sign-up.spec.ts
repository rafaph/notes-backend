import faker from "faker";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter";

describe("SignUpController", () => {
    context("When missing params", () => {
        it("Should return a bad request response when no name is provided", async () => {
            const sut = new SignUpController();
            const password = faker.internet.password();
            const response = await sut.handle({
                body: {
                    email: faker.internet.email(),
                    password,
                    passwordConfirmation: password,
                }
            });

            expect(response.statusCode).to.be.equal(400);
            expect(response.body).to.be.instanceOf(MissingParameterError).that.includes({
                paramName: "name"
            });
        });

        it("Should return a bad request response when no email is provided", async () => {
            const sut = new SignUpController();
            const password = faker.internet.password();
            const response = await sut.handle({
                body: {
                    name: faker.name.firstName(),
                    password,
                    passwordConfirmation: password,
                }
            });

            expect(response.statusCode).to.be.equals(400);
            expect(response.body).to.be.instanceOf(MissingParameterError).that.includes({
                paramName: "email"
            });
        });

        it("Should return a bad request response when no password is provided", async () => {
            const sut = new SignUpController();
            const passwordConfirmation = faker.internet.password();
            const response = await sut.handle({
                body: {
                    name: faker.name.firstName(),
                    email: faker.internet.email(),
                    passwordConfirmation,
                }
            });

            expect(response.statusCode).to.be.equals(400);
            expect(response.body).to.be.instanceOf(MissingParameterError).that.includes({
                paramName: "password"
            });
        });

        it("Should return a bad request response when no passwordConfirmation is provided", async () => {
            const sut = new SignUpController();
            const password = faker.internet.password();
            const response = await sut.handle({
                body: {
                    name: faker.name.firstName(),
                    email: faker.internet.email(),
                    password,
                }
            });

            expect(response.statusCode).to.be.equals(400);
            expect(response.body).to.be.instanceOf(MissingParameterError).that.includes({
                paramName: "passwordConfirmation"
            });
        });
    });
});
