import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNotesTable1634999266793 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "note",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        default: "gen_random_uuid()",
                        isPrimary: true,
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "title",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "body",
                        type: "text",
                        isNullable: false,
                        default: "''",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedTableName: "user",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("note");
    }
}
