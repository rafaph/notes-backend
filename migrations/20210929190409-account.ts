import Sequelize, { QueryInterface } from "sequelize";

const TABLE_NAME = "accounts";

export function up(queryInterface: QueryInterface): Promise<void> {
    return queryInterface.createTable(
        TABLE_NAME,
        {
            id: Sequelize.INTEGER,
        },
    );
}

export function down(queryInterface: QueryInterface): Promise<void> {
    return queryInterface.dropTable(TABLE_NAME);
}
