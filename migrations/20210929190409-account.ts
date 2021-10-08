import { DataTypes, QueryInterface } from "sequelize";

const TABLE_NAME = "Accounts";

export function up(queryInterface: QueryInterface): Promise<void> {
    return queryInterface.createTable(
        TABLE_NAME,
        {
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
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
    );
}

export function down(queryInterface: QueryInterface): Promise<void> {
    return queryInterface.dropTable(TABLE_NAME);
}
