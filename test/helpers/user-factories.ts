import sinon from "sinon";
import faker from "faker";
import { UserService } from "@app/domains/user/services/user-service";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { IHasher } from "@app/domains/common/interfaces/hashing";
import {
    UserBasicFields,
    UserData,
    UserPayload,
    UserPayloadWithoutAccessToken,
    UserWithID,
    UserWithRelations,
} from "@app/domains/user/types/user";
import { UserRepository } from "@app/domains/user/core/repositories/user-repository";
import { IUserDAO } from "@app/domains/user/interfaces/out/user-dao";

export function makeUserPayload(userPayload: Partial<UserPayload> = {}): UserPayload {
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        access_token: faker.datatype.uuid(),
        ...userPayload,
    };
}

export function makeUserWithID(userWithID: Partial<UserWithID> = {}): UserWithID {
    return {
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        access_token: null,
        ...userWithID,
    };
}

export function makeUserPayloadWithoutAccessToken(
    userPayloadWithoutAccessToken: Partial<UserPayloadWithoutAccessToken> = {},
): UserPayloadWithoutAccessToken {
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...userPayloadWithoutAccessToken,
    };
}

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

export function makeUserWithRelations(userWithRelations: Partial<UserWithRelations> = {}): UserWithRelations {
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        access_token: null,
        ...userWithRelations,
    };
}

export function makeUserBasicFields(userBasicFields: Partial<UserBasicFields> = {}): UserBasicFields {
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        ...userBasicFields,
    };
}

export function makeUserService(
    userRepository: Partial<IUserRepository> = {},
    hashing: Partial<IHasher> = {},
): UserService {
    const findByEmail = sinon.stub();
    const hash = sinon.stub();
    const create = sinon.stub();

    return new UserService(
        {
            create,
            findByEmail,
            ...userRepository,
        },
        {
            hash,
            ...hashing,
        },
    );
}

export function makeUserRepository(userDAO: Partial<IUserDAO> = {}): UserRepository {
    const findOne = sinon.stub();
    const save = sinon.stub();
    return new UserRepository({
        findOne,
        save,
        ...userDAO,
    });
}
