import sinon from "sinon";
import faker from "faker";
import { UserService } from "@app/domains/user/services/user-service";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { IHashing } from "@app/domains/common/interfaces/hashing";
import { CreateUserPayload, UserData } from "@app/domains/user/types/user";
import { UserRepository } from "@app/domains/user/core/repositories/user-repository";
import { IUserDAO } from "@app/domains/user/interfaces/out/user-dao";

export function makeUserData(userData: Partial<UserData> = {}): UserData {
    return {
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        access_token: null,
        ...userData,
    };
}

export function makeCreateUserPayload(createUserPayload: Partial<CreateUserPayload> = {}): CreateUserPayload {
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...createUserPayload,
    };
}

export function makeUserService(
    userRepository: Partial<IUserRepository> = {},
    hashing: Partial<IHashing> = {},
): UserService {
    return new UserService(
        {
            create: sinon.stub(),
            findByEmail: sinon.stub(),
            updateAccessToken: sinon.stub(),
            ...userRepository,
        },
        {
            hash: sinon.stub(),
            verify: sinon.stub(),
            ...hashing,
        },
    );
}

export function makeUserRepository(userDAO: Partial<IUserDAO> = {}): UserRepository {
    return new UserRepository({
        save: sinon.stub(),
        update: sinon.stub(),
        findOne: sinon.stub(),
        ...userDAO,
    });
}
