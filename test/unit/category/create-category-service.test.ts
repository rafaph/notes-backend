import { expect } from "chai";
import { FORBIDDEN } from "http-status";
import sinon from "sinon";
import { CreateCategoryService } from "@app/domains/category/services/create-category-service";
import { makeCategoryData, makeCreateCategoryDto, makeCreateCategoryService } from "@test/helpers/category-factories";

describe("CreateCategoryService @unit", () => {
    describe("Sanity tests", () => {
        it("should exists", () => {
            expect(CreateCategoryService).to.be.not.null;
            expect(CreateCategoryService).to.be.not.undefined;
        });

        it("should be a class", () => {
            expect(makeCreateCategoryService()).to.be.instanceOf(CreateCategoryService);
        });

        it("should implements ICreateCategoryService", () => {
            const instance = makeCreateCategoryService();
            expect(instance.create).to.be.instanceOf(Function);
        });
    });

    describe("Unit tests", () => {
        context("create method", () => {
            it("should create a category", async () => {
                const createCategoryDto = makeCreateCategoryDto();
                const categoryData = makeCategoryData({ name: createCategoryDto.name });
                const findByNameStub = sinon.stub().resolves(false);
                const createStub = sinon.stub().resolves(categoryData);
                const sut = makeCreateCategoryService({
                    findByName: findByNameStub,
                    create: createStub,
                });

                const createdCategoryData = await sut.create(createCategoryDto);

                expect(createdCategoryData).to.be.deep.equal(categoryData);
                expect(findByNameStub).to.have.been.calledOnceWithExactly({
                    ...createCategoryDto,
                    fields: ["id"],
                });
                expect(createStub).to.have.been.calledOnceWithExactly(createCategoryDto);
            });

            it("should throw if categoryRepository.findByName returns a category", async () => {
                const createCategoryDto = makeCreateCategoryDto();
                const findByNameStub = sinon.stub().resolves(true);
                const sut = makeCreateCategoryService({
                    findByName: findByNameStub,
                });

                await expect(sut.create(createCategoryDto)).to.eventually.be.rejected.with.property(
                    "status",
                    FORBIDDEN,
                );
                expect(findByNameStub).to.have.been.calledOnceWithExactly({
                    ...createCategoryDto,
                    fields: ["id"],
                });
            });

            it("should throw if categoryRepository.findByName throws", async () => {
                const createCategoryDto = makeCreateCategoryDto();
                const findByNameStub = sinon.stub().rejects();
                const sut = makeCreateCategoryService({
                    findByName: findByNameStub,
                });

                await expect(sut.create(createCategoryDto)).to.eventually.be.rejected;
                expect(findByNameStub).to.have.been.calledOnceWithExactly({
                    ...createCategoryDto,
                    fields: ["id"],
                });
            });

            it("should throw if categoryRepository.create throws", async () => {
                const createCategoryDto = makeCreateCategoryDto();
                const findByNameStub = sinon.stub().resolves(false);
                const createStub = sinon.stub().rejects();
                const sut = makeCreateCategoryService({
                    findByName: findByNameStub,
                    create: createStub,
                });

                await expect(sut.create(createCategoryDto)).to.eventually.be.rejected;
                expect(findByNameStub).to.have.been.calledOnceWithExactly({
                    ...createCategoryDto,
                    fields: ["id"],
                });
                expect(createStub).to.have.been.calledOnceWithExactly(createCategoryDto);
            });
        });
    });
});
