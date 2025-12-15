import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CaseStatus } from "src/common/enums/case-status.enum";
import { User } from "src/modules/user/entities/user.entity";
import { Appointment } from "src/modules/appointment/entities/appointment.entity";
import { ActivityLog } from "src/modules/activity/entities/activity.entity";

@Entity('cases')
export class Case {


    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, name: "case_number"})
    caseNumber: string;

    @Column({name: "title"})
    title: string;

    @Column({type: "enum", enum: CaseStatus, default: CaseStatus.PENDING})
    status: CaseStatus;

    @Column({name: "lawyer_id"})
    lawyerId: number;
    
    @Column({name: "client_id"})
    clientId: number;

    @Column({nullable: true})
    court: string;

    @Column({type: "datetime", nullable: true, name: "filing_date"})
    filingDate: Date;

    @Column({type: "datetime", nullable: true, name: "next_hearing"})
    nextHearing: Date;

    @Column({name: "created_at"})
    createdAt: Date;

    @Column({name: "updated_at"})
    updatedAt: Date;    

    @ManyToOne(() => User, (user) => user.casesAsLawyer)
    @JoinColumn({ name: 'lawyer_id' })
    lawyer: User;

    @ManyToOne(() => User, (user) => user.casesAsClient)
    @JoinColumn({ name: 'client_id' })
    client: User;

    @OneToMany(() => Appointment, (appointment) => appointment.case)
    appointments: Appointment[]

     @OneToMany(() => ActivityLog, (log) => log.case)
    activityLogs: ActivityLog[];

    


}
