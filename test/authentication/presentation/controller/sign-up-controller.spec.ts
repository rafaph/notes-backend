import faker from "faker";
import sinon from "sinon";
import { SignUpController } from "@app/authentication/presentation/controller/sign-up-controller";
import { AddAccount } from "@app/authentication/domain/use-case/add-account";
import { HttpStatusCodes } from "@app/shared/utils/http-status-codes";
import { Validator } from "@app/shared/presentation/protocol/validator";
import { badRequest } from "@app/shared/presentation/helper/http/http-helper";

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        public async execute(input: AddAccount.Input): Promise<AddAccount.Output> {
            return {
                id: "valid_id",
                name: input.name,
                email: input.email,
                password: input.password,
            };
        }
    }

    return new AddAccountStub();
};

const makeValidator = (): Validator => {
    class ValidatorStub implements Validator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public async validate(_input: unknown): Promise<Error | undefined> {
            return undefined;
        }
    }

    return new ValidatorStub();
};

const makeSut = (): {
    sut: SignUpController,
    addAccountStub: AddAccount,
    validatorStub: Validator,
} => {
    const addAccountStub = makeAddAccount();
    const validatorStub = makeValidator();
    const sut = new SignUpController(addAccountStub, validatorStub);
    return {
        sut,
        addAccountStub,
        validatorStub,
    };
};

const makeBody = (overrides: Partial<SignUpController.RequestBody> = {}): SignUpController.RequestBody => {
    const password = faker.internet.password();
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
        ...overrides,
    };
};

describe("SignUpController", () => {
    it("Should call AddAccount with correct values", async () => {
        const { sut, addAccountStub } = makeSut();
        const body = makeBody();

        const addAccountExecuteSpy = sinon.spy(addAccountStub, "execute");
        await sut.handle({ body });

        expect(addAccountExecuteSpy.calledOnceWith({
            name: body.name as string,
            email: body.email as string,
            password: body.password as string,
        })).to.be.true;
    });

    it("Should return a server error response if AddAccount throws", async () => {
        const { sut, addAccountStub } = makeSut();
        const body = makeBody();

        sinon.stub(addAccountStub, "execute").rejects();
        const response = await sut.handle({ body });

        expect(response.statusCode).to.be.equal(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("Should return a ok response if correct values is provided", async () => {
        const { sut } = makeSut();
        const body = makeBody();
        const response = await sut.handle({ body });

        expect(response.statusCode).to.be.equal(HttpStatusCodes.OK);
        expect(response.body).to.be.deep.equal({
            id: "valid_id",
            name: body.name,
            email: body.email,
        });
    });

    it("Should call Validation with correct value", async () => {
        const { sut, validatorStub } = makeSut();
        const body = makeBody();

        const isValidSpy = sinon.spy(validatorStub, "validate");
        await sut.handle({ body });

        sinon.assert.calledOnceWithExactly(isValidSpy, body);
    });

    it("Should return a bad request if Validation returns a error", async () => {
        const { sut, validatorStub } = makeSut();
        const body = makeBody();
        const error = new Error();

        sinon.stub(validatorStub, "validate").resolves(error);
        const response = await sut.handle({ body });

        expect(response).to.be.deep.equal(badRequest(error));
    });
});
