import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNoteCategoryTable1635019907583 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "note_category",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        default: "gen_random_uuid()",
                        isPrimary: true,
                    },
                    {
                        name: "note_id",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "category_id",
                        type: "varchar",
                        isNullable: false,
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
                        columnNames: ["note_id"],
                        referencedTableName: "note",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                    {
                        columnNames: ["category_id"],
                        referencedTableName: "category",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                ],
                uniques: [
                    {
                        columnNames: ["note_id", "category_id"],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("note_category");
    }
}
