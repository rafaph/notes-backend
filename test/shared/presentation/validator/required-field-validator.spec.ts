import faker from "faker";
import { RequiredFieldValidator } from "@app/shared/presentation/validator/required-field-validator";
import { MissingParameterError } from "@app/shared/presentation/error/missing-parameter-error";

describe("RequiredFieldValidator", () => {
    it("Should return a MissingParameterError if validation fails", async () => {
        const sut = new RequiredFieldValidator(faker.random.word());
        const result = await sut.validate({});

        expect(result).to.be.an.instanceOf(MissingParameterError);
    });

    it("Should return undefined if is valid", async () => {
        const field = faker.random.word();
        const sut = new RequiredFieldValidator(field);
        const result = await sut.validate({
            [field]: faker.random.word()
        });

        expect(result).to.be.undefined;
    });
});
