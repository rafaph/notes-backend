import { INTERNAL_SERVER_ERROR } from "http-status";
import { inject, Lifecycle, registry, scoped } from "tsyringe";
import { Logger } from "@app/domains/common/utils/logger";
import { ResponseError } from "@app/domains/common/utils/response-error";
import { IUserRepository } from "@app/domains/user/interfaces/in/user-repository";
import { IUserDAO } from "@app/domains/user/interfaces/out/user-dao";
import { CreateUserPayload, UserData } from "@app/domains/user/types/user";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "UserRepository", useClass: UserRepository }])
export class UserRepository implements IUserRepository {
    public constructor(@inject("UserDAO") private readonly userDAO: IUserDAO) {}

    public async findById(id: string, fields?: Array<keyof UserData>): Promise<UserData | void> {
        try {
            return await this.userDAO.findOne({
                where: {
                    id,
                },
                select: fields,
            });
        } catch (error) {
            const message = "Error to find user by id.";
            Logger.error(message, error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, message);
        }
    }

    public async findByEmail(email: string, fields?: Array<keyof UserData>): Promise<UserData | void> {
        try {
            return await this.userDAO.findOne({
                where: {
                    email,
                },
                select: fields,
            });
        } catch (error) {
            const message = "Error to find user by email.";
            Logger.error(message, error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, message);
        }
    }

    public async create(user: CreateUserPayload): Promise<UserData> {
        try {
            return await this.userDAO.save(user);
        } catch (error) {
            const message = "Unable to create user";
            Logger.error(message, error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, message);
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
            const message = "Unable to update user access token";
            Logger.error(message, error);
            throw new ResponseError(INTERNAL_SERVER_ERROR, message);
        }
    }
}
