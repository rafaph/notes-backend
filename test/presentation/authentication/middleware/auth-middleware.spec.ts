import { forbidden } from "@app/presentation/shared/helper/http/http-helper";
import { AccessDeniedError } from "@app/presentation/shared/error/access-denied-error";
import { AuthMiddleware } from "@app/presentation/authentication/middleware/auth-middleware";

describe.only("AuthMiddleware", () => {
    it("Should return a forbidden response if no Authorization header exists", async () => {
       const sut = new AuthMiddleware();
       const response = await sut.handle({});
       const expectedResponse = forbidden(new AccessDeniedError());

       expect(response.statusCode).to.be.equals(expectedResponse.statusCode);
       expect(response.body).to.be.instanceOf(AccessDeniedError);
    });
});
