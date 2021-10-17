import { FromEntityType } from "@app/domains/common/types/from-entity-type";
import { User } from "@app/domains/user/core/entities/user";

export interface UserPayload {
    name: string;
    email: string;
    password: string;
    access_token: string | null;
}

export interface UserWithID extends UserPayload {
    id: string;
}

export type UserPayloadWithoutAccessToken = Omit<UserPayload, "access_token">;

export type UserData = Omit<FromEntityType<User>, "created_at" | "updated_at">;

// eslint-disable-next-line
export interface UserWithRelations extends Omit<UserData, "id"> {}

export type UserBasicFields = Pick<UserPayload, "email" | "name">;

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
    access_token?: string | null;
}
