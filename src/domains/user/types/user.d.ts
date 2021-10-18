import { FromEntityType } from "@app/domains/common/types/from-entity-type";
import { User } from "@app/domains/user/core/entities/user";

export type UserData = Omit<FromEntityType<User>, "created_at" | "updated_at">;

export type CreateUserPayload = Omit<UserData, "access_token" | "id">;

export type UpdateUserPayload = Partial<Omit<UserData, "id">>;
