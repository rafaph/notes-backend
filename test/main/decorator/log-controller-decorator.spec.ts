import sinon from "sinon";
import faker from "faker";
import { LogControllerDecorator } from "@app/main/decorator/log-controller-decorator";
import { Controller } from "@app/presentation/shared/protocol/controller";
import { HttpResponse } from "@app/presentation/shared/protocol/http";
import { HttpStatusCodes } from "@app/utils/http-status-codes";
import { Logger } from "@app/utils/logger";

const CONTROLLER_RESPONSE_BODY = new Error();

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        public async handle(): Promise<HttpResponse> {
            return {
                statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                body: CONTROLLER_RESPONSE_BODY,
            };
        }
    }

    return new ControllerStub();
};

const makeSut = (): {
    controller: Controller;
    sut: LogControllerDecorator;
} => {
    const controller = makeController();
    return {
        controller,
        sut: new LogControllerDecorator(controller),
    };
};

describe("LogControllerDecorator", () => {
    let errorStub: sinon.SinonStub<[message: string, meta?: unknown], void>;

    beforeEach(() => {
        errorStub = sinon.stub(Logger, "error").onFirstCall().returns();
    });

    afterEach(() => {
        errorStub.restore();
    });

    it("Should call controller handle with same request object", async () => {
        const { sut, controller } = makeSut();
        const controllerHandleStub = sinon.stub(controller, "handle").resolves({
            statusCode: HttpStatusCodes.OK,
        });
        const request = {
            body: faker.datatype.uuid(),
        };

        await sut.handle(request);

        sinon.assert.calledOnceWithExactly(controllerHandleStub, request);
    });

    it("Should return the same response as controller", async () => {
        const { sut, controller } = makeSut();
        const controllerResponse = {
            statusCode: HttpStatusCodes.OK,
            body: faker.datatype.uuid(),
        };
        sinon.stub(controller, "handle").resolves(controllerResponse);

        const sutResponse = await sut.handle({});

        expect(sutResponse).to.be.deep.equal(controllerResponse);
    });

    it("Should log error when controller returns a internal server error", async () => {
        const { sut } = makeSut();

        await sut.handle({});

        sinon.assert.calledOnceWithExactly(errorStub, "error", CONTROLLER_RESPONSE_BODY);
    });

    it("Should not log error when controller not return a internal server error", async () => {
        const { sut, controller } = makeSut();
        sinon.stub(controller, "handle").onFirstCall().resolves({
            statusCode: HttpStatusCodes.OK,
        });

        await sut.handle({});

        sinon.assert.callCount(errorStub, 0);
    });
});
