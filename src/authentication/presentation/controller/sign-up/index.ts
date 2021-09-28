import { HttpRequest, HttpResponse } from "@app/shared/presentation/protocol/http";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter";
import { ServerError } from "@app/shared/presentation/error/server";

export class SignUpController {
    public async handle(request: HttpRequest<SignUpController.RequestBody>): Promise<HttpResponse<SignUpController.ResponseBody>> {
        if (request.body === undefined) {
            return {
                statusCode: 500,
                body: new ServerError(),
            };
        }

        const requiredFields: SignUpController.RequestBodyKey[] = [
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
            body: {
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password"
            }
        };
    }
}

export namespace SignUpController {
    export interface RequestBody {
        name?: string;
        email?: string;
        password?: string;
        passwordConfirmation?: string;
    }

    export type RequestBodyKey = keyof RequestBody;

    export type ResponseBody = Error | { name: string; email: string; password: string };
}
