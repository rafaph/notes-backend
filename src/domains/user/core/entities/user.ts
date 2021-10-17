import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: "users",
})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column()
    public name!: string;

    @Column()
    public email!: string;

    @Column()
    public password!: string;

    @Column({
        type: "text",
        nullable: true,
        default: null,
    })
    public access_token: string | null = null;

    @CreateDateColumn()
    public created_at!: Date;

    @UpdateDateColumn()
    public updated_at!: Date;
}
