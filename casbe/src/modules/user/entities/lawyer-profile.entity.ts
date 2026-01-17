import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("lawyer_profile")
export class LawyerProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'simple-array'})
    specializations: string[];

    @Column()
    experience: number;

    @Column({type:"float", default: 0})
    successRate: number;

    @Column({default: true})
    active: boolean;

    @OneToOne(() => User, (user) => user.lawyerProfile, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: User
}