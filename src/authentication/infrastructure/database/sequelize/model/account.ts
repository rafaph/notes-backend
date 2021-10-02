import { DataTypes, Model, ModelCtor, Optional, Sequelize } from "sequelize";

export interface AccountAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
}

export type AccountCreationAttributes = Optional<AccountAttributes, "id">;

export interface UserInstance extends Model<AccountAttributes, AccountCreationAttributes>, AccountAttributes {
}

export type SequelizeAccount = ModelCtor<UserInstance>;

export const AccountFactory = (sequelize: Sequelize): SequelizeAccount => {
    return sequelize.define<UserInstance>("Account", {
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
    });
};

