import { expect } from "chai";
import faker from "faker";
import { INTERNAL_SERVER_ERROR } from "http-status";
import sinon from "sinon";
import { CategoryRepository } from "@app/domains/category/core/repositories/category-repository";
import { CategoryData } from "@app/domains/category/types/category";
import { makeCategoryData, makeCategoryRepository, makeCreateCategoryDto } from "@test/helpers/category-factories";

describe("CategoryRepository @unit", () => {
    describe("Sanity tests", () => {
        it("should exists", () => {
            expect(CategoryRepository).to.be.not.null;
            expect(CategoryRepository).to.be.not.undefined;
        });

        it("should be a class", () => {
            expect(makeCategoryRepository()).to.be.instanceOf(CategoryRepository);
        });

        it("should implements ICategoryRepository", () => {
            const sut = makeCategoryRepository();
            expect(sut.create).to.be.instanceOf(Function);
            expect(sut.findByNameAndUserId).to.be.instanceOf(Function);
        });
    });

    describe("Unit tests", () => {
        context("create method", () => {
            it("should create a category", async () => {
                const expectedCategoryData = makeCategoryData();
                const saveStub = sinon.stub().resolves(expectedCategoryData);
                const categoryDto = makeCreateCategoryDto();

                const sut = makeCategoryRepository({
                    save: saveStub,
                });

                const categoryData = await sut.create(categoryDto);

                expect(categoryData).to.be.deep.equal(expectedCategoryData);
                expect(saveStub).to.have.been.calledOnceWithExactly(categoryDto);
            });

            it("should throw a ResponseError if save throws", async () => {
                const saveStub = sinon.stub().rejects();
                const categoryDto = makeCreateCategoryDto();

                const sut = makeCategoryRepository({
                    save: saveStub,
                });

                await expect(sut.create(categoryDto)).to.eventually.be.rejected.with.property(
                    "status",
                    INTERNAL_SERVER_ERROR,
                );
                expect(saveStub).to.have.been.calledOnceWithExactly(categoryDto);
            });
        });

        context("findByNameAndUserId method", () => {
            it("should find a category by name and userId", async () => {
                const name = faker.name.firstName();
                const userId = faker.datatype.uuid();
                const fields: Array<keyof CategoryData> = ["id"];
                const expectedCategoryData = makeCategoryData();
                const findOneStub = sinon.stub().resolves(expectedCategoryData);

                const sut = makeCategoryRepository({
                    findOne: findOneStub,
                });

                const categoryData = await sut.findByNameAndUserId(name, userId, fields);

                expect(categoryData).to.be.deep.equals(expectedCategoryData);
                expect(findOneStub).to.have.been.calledOnceWithExactly({
                    where: {
                        name,
                        user_id: userId,
                    },
                    select: fields,
                });
            });

            it("should return undefined if findOne returns undefined", async () => {
                const name = faker.name.firstName();
                const userId = faker.datatype.uuid();
                const findOneStub = sinon.stub().resolves();

                const sut = makeCategoryRepository({
                    findOne: findOneStub,
                });

                const categoryData = await sut.findByNameAndUserId(name, userId);

                expect(categoryData).to.be.undefined;
                expect(findOneStub).to.have.been.calledOnceWithExactly({
                    where: {
                        name,
                        user_id: userId,
                    },
                    select: undefined,
                });
            });

            it("should throw a ResponseError if findOne throws", async () => {
                const name = faker.name.firstName();
                const userId = faker.datatype.uuid();
                const fields: Array<keyof CategoryData> = ["id"];
                const findOneStub = sinon.stub().rejects();

                const sut = makeCategoryRepository({
                    findOne: findOneStub,
                });

                await expect(sut.findByNameAndUserId(name, userId, fields)).to.eventually.be.rejected.with.property(
                    "status",
                    INTERNAL_SERVER_ERROR,
                );
                expect(findOneStub).to.have.been.calledOnceWithExactly({
                    where: {
                        name,
                        user_id: userId,
                    },
                    select: fields,
                });
            });
        });
    });
});
