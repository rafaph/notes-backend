import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { FORBIDDEN } from "http-status";
import { IUserService } from "@app/domains/user/interfaces/in/user-service";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { IHashing } from "@app/domains/common/interfaces/hashing";
import { CreateUserPayload, UserData } from "@app/domains/user/types/user";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "UserService", useClass: UserService }])
export class UserService implements IUserService {
    public constructor(
        @inject("UserRepository") private readonly userRepository: IUserRepository,
        @inject("Hashing") private readonly hashing: IHashing,
    ) {}

    public async create(input: CreateUserPayload): Promise<UserData> {
        const foundUser = await this.userRepository.findByEmail(input.email, ["id"]);

        if (foundUser) {
            throw new ResponseError(FORBIDDEN, "The provided email is already in use.");
        }

        return await this.userRepository.create({
            ...input,
            password: await this.hashing.hash(input.password),
        });
    }
}
