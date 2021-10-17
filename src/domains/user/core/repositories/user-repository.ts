import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { UserPayload, UserWithID } from "@app/domains/user/types/user";
import { IUserDAO } from "@app/domains/user/interfaces/out/user-dao";
import { Logger } from "@app/domains/common/utils/logger";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { INTERNAL_SERVER_ERROR } from "http-status";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "UserRepository", useClass: UserRepository }])
export class UserRepository implements IUserRepository {
    public constructor(@inject("UserDAO") private readonly userDAO: IUserDAO) {}

    public findByEmail(email: string): Promise<UserWithID | void> {
        try {
            return this.userDAO.findOne({
                where: {
                    email,
                },
            });
        } catch (error) {
            Logger.error("Unable to find user", error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, "Error to find user.");
        }
    }

    public create(user: UserPayload): Promise<UserWithID> {
        try {
            return this.userDAO.save(user);
        } catch (error) {
            Logger.error("Unable to create user", error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, "Error to create user.");
        }
    }
}
