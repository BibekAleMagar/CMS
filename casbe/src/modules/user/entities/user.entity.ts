import { CaseStatus } from "src/common/enums/case-status.enum";
import { UserRole } from "src/common/enums/user-role.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.CLIENT})
    role: UserRole

    @Column({nullable: true})
    phone: string;

    @Column()
    avatar: string;

    @Column({name: 'is_active', default: true})
    isActive: boolean;

    @Column({name: 'created_at',})
    createdAt: string

    @Column({name: "updated_at"})
    updatedAt: string;

    // @OneToMany(() => CaseStatus)


}
