import validator from "validator";
import { EmailValidator } from "@app/authentication/presentation/protocol/email-validator";

export class EmailValidatorAdapter implements EmailValidator {
    public isValid(email: string): boolean {
        return validator.isEmail(email);
    }
}
