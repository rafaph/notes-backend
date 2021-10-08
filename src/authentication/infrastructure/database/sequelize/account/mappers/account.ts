import { AccountInstance } from "@app/authentication/infrastructure/database/sequelize/account/model/account";
import { AccountModel } from "@app/authentication/domain/model/account-model";

export function fromDatabase(attributes: AccountInstance): AccountModel {
    return {
        id: attributes.id,
        name: attributes.name,
        email: attributes.email,
        password: attributes.password,
    };
}
