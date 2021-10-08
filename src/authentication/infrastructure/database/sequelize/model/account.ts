import { DataTypes, Model, ModelCtor, Optional, Sequelize } from "sequelize";

export interface AccountAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    accessToken: string | null;
}

export type AccountCreationAttributes = Optional<AccountAttributes, "accessToken" | "id">;

export interface AccountInstance extends Model<AccountAttributes, AccountCreationAttributes>, AccountAttributes {
}

export type SequelizeAccount = ModelCtor<AccountInstance>;

export const AccountFactory = (sequelize: Sequelize): SequelizeAccount => {
    return sequelize.define<AccountInstance>("Account", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
    });
};

