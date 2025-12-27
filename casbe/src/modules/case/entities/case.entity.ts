import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({
    type: "enum",
    enum: ["CRIMINAL", "CIVIL", "FAMILY", "CORPORATE", "LABOUR", "PROPERTY"],
    name: "case_type"
    })
    caseType: string;

    @Column({
    type: "varchar",
    name: "case_subtype",
    nullable: true
    })
    caseSubType: string; 

    @Column({name: "title"})
    title: string;

    @Column({type: "enum", enum: CaseStatus, default: CaseStatus.PENDING})
    status: CaseStatus;

    @Column({name: "lawyer_id", nullable: true})
    lawyerId?: number;
    
    @Column({name: "client_id"})
    clientId: number;

    @Column({nullable: true})
    court: string;

    @Column({type: "datetime", nullable: true, name: "filing_date"})
    filingDate: Date;

    @Column({type: "datetime", nullable: true, name: "next_hearing"})
    nextHearing: Date;

    @CreateDateColumn({name: "created_at", type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at", type: "timestamp"})
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
