import sinon from "sinon";
import faker from "faker";
import { UserService } from "@app/domains/user/services/user-service";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { IHasher } from "@app/domains/common/interfaces/hashing";
import { UserWithID } from "@app/domains/user/types/user";

export function userServiceFactory(
    userRepository: Partial<IUserRepository> = {},
    hashing: Partial<IHasher> = {},
): UserService {
    const findByEmail = sinon.stub().resolves(false);
    const outputCreate: UserWithID = {
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        access_token: null,
    };
    const hash = sinon.stub().resolves(outputCreate.password);
    const create = sinon.stub().resolves(outputCreate);

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
