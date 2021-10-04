import { LoginController } from "@app/authentication/presentation/controller/login-controller";
import faker from "faker";
import { badRequest } from "@app/shared/presentation/helper/http-helper";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";

describe.only("LoginController", () => {
    it("Should return a bad request if no email is provided", async () => {
        const sut = new LoginController();
        const request = {
            body: {
                password: faker.internet.password(),
            },
        };
        const response = await sut.handle(request);
        const expectedResponse = badRequest(new MissingParameterError("email"));

        expect(response.statusCode).to.be.equal(expectedResponse.statusCode);
        expect(response.body).to.be.instanceOf(MissingParameterError);
        expect(response.body?.message).to.be.equal(expectedResponse.body?.message);
    });
});
