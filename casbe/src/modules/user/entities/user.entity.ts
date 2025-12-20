import { CaseStatus } from "src/common/enums/case-status.enum";
import { UserRole } from "src/common/enums/user-role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Case } from "src/modules/case/entities/case.entity";
import { Appointment } from "src/modules/appointment/entities/appointment.entity";
import { CaseDocument } from "src/modules/documents/entities/document.entity";
import { ActivityLog } from "src/modules/activity/entities/activity.entity";

@Entity('users')
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

    @Column({nullable: true})
    avatar: string;

    @Column({name: 'is_active', default: true})
    isActive: boolean;

    @CreateDateColumn({name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @CreateDateColumn({name: "updated_at", type: 'timestamp'})
    updatedAt: Date;

    @OneToMany(() => Case, (caseEntity) => caseEntity.lawyer)
    casesAsLawyer: Case[];

    @OneToMany(() => Case, (caseEntity) => caseEntity.client)
    casesAsClient: Case[];

    @OneToMany(() => CaseDocument, (caseDocument) => caseDocument.uploader)
    documents: CaseDocument[];

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];

    @OneToMany(() => ActivityLog, (log) => log.user)
    activityLogs: ActivityLog[];

}
