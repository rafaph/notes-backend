import { AccountInstance } from "@app/infrastructure/authentication/persistence/sequelize/model/account";
import { AccountModel } from "@app/domain/authentication/model/account-model";

export function fromDatabase(attributes: AccountInstance): AccountModel {
    return {
        id: attributes.id,
        name: attributes.name,
        email: attributes.email,
        password: attributes.password,
    };
}
