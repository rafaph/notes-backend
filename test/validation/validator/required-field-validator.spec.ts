import faker from "faker";
import { MissingParameterError } from "@app/presentation/shared/error/missing-parameter-error";
import { RequiredFieldValidator } from "@app/validation/validator/required-field-validator";

const makeSut = (field = faker.random.word()): RequiredFieldValidator => new RequiredFieldValidator(field);

describe("RequiredFieldValidator", () => {
    it("Should return a MissingParameterError if validation fails", async () => {
        const sut = makeSut();
        const result = await sut.validate({});

        expect(result).to.be.an.instanceOf(MissingParameterError);
    });

    it("Should return null if is valid", async () => {
        const field = faker.random.word();
        const sut = makeSut(field);
        const result = await sut.validate({
            [field]: faker.random.word(),
        });

        expect(result).to.be.null;
    });
});
