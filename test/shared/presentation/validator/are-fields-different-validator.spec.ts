import faker from "faker";
import { FieldsDifferentValidator } from "@app/shared/presentation/validator/fields-different-validator";
import { InvalidParameterError } from "@app/shared/presentation/error/invalid-parameter-error";

const makeSut = (
    field = faker.random.word(),
    fieldToCompare = faker.random.word(),
): FieldsDifferentValidator => (
    new FieldsDifferentValidator(field, fieldToCompare)
);

describe("AreFieldsDifferentValidator", () => {
    it("Should return a InvalidParameterError if validation fails", async () => {
        const field = faker.random.word();
        const fieldToCompare = faker.random.word();
        const sut = makeSut(field, fieldToCompare);
        const result = await sut.validate({
            [field]: faker.random.word(),
            [fieldToCompare]: faker.random.word(),
        });

        expect(result).to.be.an.instanceOf(InvalidParameterError);
    });

    it("Should return undefined if is valid", async () => {
        const field = faker.random.word();
        const fieldToCompare = faker.random.word();
        const sut = makeSut(field, fieldToCompare);
        const value = faker.random.word();
        const result = await sut.validate({
            [field]: value,
            [fieldToCompare]: value,
        });

        expect(result).to.be.undefined;
    });
});
