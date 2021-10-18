import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { CreateUserPayload, UserData } from "@app/domains/user/types/user";
import { IUserDAO } from "@app/domains/user/interfaces/out/user-dao";
import { Logger } from "@app/domains/common/utils/logger";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { INTERNAL_SERVER_ERROR } from "http-status";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "UserRepository", useClass: UserRepository }])
export class UserRepository implements IUserRepository {
    public constructor(@inject("UserDAO") private readonly userDAO: IUserDAO) {}

    public async findByEmail(email: string, fields?: Array<keyof UserData>): Promise<UserData | void> {
        try {
            return await this.userDAO.findOne({
                where: {
                    email,
                },
                select: fields,
            });
        } catch (error) {
            Logger.error("Unable to find user", error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, "Error to find user.");
        }
    }

    public async create(user: CreateUserPayload): Promise<UserData> {
        try {
            return await this.userDAO.save(user);
        } catch (error) {
            Logger.error("Unable to create user", error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, "Error to create user.");
        }
    }

    public async updateAccessToken(id: string, accessToken: string): Promise<void> {
        try {
            await this.userDAO.update(
                {
                    id,
                },
                {
                    access_token: accessToken,
                },
            );
        } catch (error) {
            Logger.error("Unable to update user", error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, "Error to update user.");
        }
    }
}
