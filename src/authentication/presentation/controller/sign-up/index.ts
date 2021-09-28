import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter";
import { ServerError } from "@app/shared/presentation/error/server";

interface SignUpControllerRequestBody {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
}

type SignUpControllerResponseBody = Error | { name: string; email: string; password: string };

export class SignUpController {
    public async handle(request: HttpRequest<SignUpControllerRequestBody>): Promise<HttpResponse<SignUpControllerResponseBody>> {
        if (request.body === undefined) {
            return {
                statusCode: 500,
                body: new ServerError(),
            };
        }

        const requiredFields: Array<keyof SignUpControllerRequestBody> = [
            "name",
            "email",
            "password",
            "passwordConfirmation",
        ];

        for (const requiredField of requiredFields) {
            if (request.body[requiredField] === undefined) {
                return {
                    statusCode: 400,
                    body: new MissingParameterError(requiredField),
                };
            }
        }

        return {
            statusCode: 200,
        };
    }
}
