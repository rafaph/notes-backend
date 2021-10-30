import { ICreateRepository } from "@app/domains/category/interfaces/repositories/create-repository";
import { IFindByNameAndUserIdRepository } from "@app/domains/category/interfaces/repositories/find-by-name-and-user-id-repository";

export type ICategoryRepository = ICreateRepository & IFindByNameAndUserIdRepository;
