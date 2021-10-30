import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from "typeorm";
import { User } from "@app/domains/user/core/entities/user";

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column()
    public name!: string;

    @Column()
    public user_id!: string;

    @CreateDateColumn()
    public created_at!: Date;

    @UpdateDateColumn()
    public updated_at!: Date;

    @ManyToOne(() => User, (user) => user.categories)
    @JoinColumn({ name: "user_id" })
    public user!: User;
}
