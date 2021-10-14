import { TokenValidator } from "@app/validation/validator/token-validator";
import faker from "faker";
import { InvalidHeaderError } from "@app/presentation/shared/error/invalid-header-error";

const makeSut = (): {
    sut: TokenValidator
    input: Record<string, unknown>
    field: string
} => {
    const field = faker.random.word();
    return {
        sut: new TokenValidator(field),
        input: {
            [field]: `Bearer ${faker.datatype.uuid()}`,
        },
        field,
    };
};

describe("TokenValidator", () => {
    it("Should return InvalidHeaderError if token is not a string", async () => {
        const { sut, field } = makeSut();
        const error = await sut.validate({
            [field]: faker.datatype.number(),
        });

        expect(error).to.be.instanceOf(InvalidHeaderError);
        expect((error as InvalidHeaderError).headerName).to.be.equals(field);
    });
});
