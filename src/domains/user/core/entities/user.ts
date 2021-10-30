import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Category } from "@app/domains/category/core/entities/category";

@Entity()
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

    @OneToMany(() => Category, (category) => category.user)
    public categories!: Category[];
}
