import validator from "validator";
import { IsEmailValidator } from "@app/validation/protocol/is-email-validator";

export class IsEmailValidatorAdapter implements IsEmailValidator {
    public isValid(email: string): boolean {
        return validator.isEmail(email);
    }
}
