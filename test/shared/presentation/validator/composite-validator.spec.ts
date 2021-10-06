import sinon from "sinon";
import { Validator } from "@app/shared/presentation/protocol/validator";
import { CompositeValidator } from "@app/shared/presentation/validator/composite-validator";

const makeValidator = (): Validator => {
    class ValidatorStub implements Validator {
        public async validate(): Promise<Error | undefined> {
            return undefined;
        }
    }

    return new ValidatorStub();
};

const makeSut = (): {
    sut: Validator;
    validatorStubs: Validator[];
} => {
    const validatorStubs = [makeValidator(), makeValidator()];
    const sut = new CompositeValidator(validatorStubs);
    return {
        sut,
        validatorStubs,
    };
};

describe("CompositeValidator", () => {
    it("Should return an error if any validator fails", async () => {
        const { sut, validatorStubs } = makeSut();
        const error = new Error();
        sinon.stub(validatorStubs[1], "validate").resolves(error);
        const result = await sut.validate({});

        expect(result).to.be.deep.equal(error);
    });

    it("Should return the first error if more than one validator fails", async () => {
        const { sut, validatorStubs } = makeSut();
        const error1 = new Error();
        const error2 = new Error();
        sinon.stub(validatorStubs[0], "validate").resolves(error1);
        sinon.stub(validatorStubs[1], "validate").resolves(error2);

        const result = await sut.validate({});

        expect(result).to.be.deep.equal(error1);
    });

    it("Should return undefined if validator succeed", async () => {
        const { sut } = makeSut();
        const result = await sut.validate({});

        expect(result).to.be.undefined;
    });
});
