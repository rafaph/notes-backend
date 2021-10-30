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
                const findByNameAndUserIdStub = sinon.stub().resolves(false);
                const createStub = sinon.stub().resolves(categoryData);
                const sut = makeCreateCategoryService({
                    findByNameAndUserId: findByNameAndUserIdStub,
                    create: createStub,
                });

                const createdCategoryData = await sut.create(createCategoryDto);

                expect(createdCategoryData).to.be.deep.equal(categoryData);
                expect(findByNameAndUserIdStub).to.have.been.calledOnceWithExactly(
                    createCategoryDto.name,
                    createCategoryDto.user_id,
                    ["id"],
                );
                expect(createStub).to.have.been.calledOnceWithExactly(createCategoryDto);
            });

            it("should throw if categoryRepository.findByName returns a category", async () => {
                const createCategoryDto = makeCreateCategoryDto();
                const findByNameAndUserIdStub = sinon.stub().resolves(true);
                const sut = makeCreateCategoryService({
                    findByNameAndUserId: findByNameAndUserIdStub,
                });

                await expect(sut.create(createCategoryDto)).to.eventually.be.rejected.with.property(
                    "status",
                    FORBIDDEN,
                );
                expect(findByNameAndUserIdStub).to.have.been.calledOnceWithExactly(
                    createCategoryDto.name,
                    createCategoryDto.user_id,
                    ["id"],
                );
            });

            it("should throw if categoryRepository.findByName throws", async () => {
                const createCategoryDto = makeCreateCategoryDto();
                const findByNameAndUserIdStub = sinon.stub().rejects();
                const sut = makeCreateCategoryService({
                    findByNameAndUserId: findByNameAndUserIdStub,
                });

                await expect(sut.create(createCategoryDto)).to.eventually.be.rejected;
                expect(findByNameAndUserIdStub).to.have.been.calledOnceWithExactly(
                    createCategoryDto.name,
                    createCategoryDto.user_id,
                    ["id"],
                );
            });

            it("should throw if categoryRepository.create throws", async () => {
                const createCategoryDto = makeCreateCategoryDto();
                const findByNameAndUserIdStub = sinon.stub().resolves(false);
                const createStub = sinon.stub().rejects();
                const sut = makeCreateCategoryService({
                    findByNameAndUserId: findByNameAndUserIdStub,
                    create: createStub,
                });

                await expect(sut.create(createCategoryDto)).to.eventually.be.rejected;
                expect(findByNameAndUserIdStub).to.have.been.calledOnceWithExactly(
                    createCategoryDto.name,
                    createCategoryDto.user_id,
                    ["id"],
                );
                expect(createStub).to.have.been.calledOnceWithExactly(createCategoryDto);
            });
        });
    });
});
