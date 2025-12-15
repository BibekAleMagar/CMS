import { AppointmentStatus } from "src/common/enums/appointment-status.enem";
import { Case } from "src/modules/case/entities/case.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('appointments')
export class Appointment {


    @PrimaryGeneratedColumn()
    id:number;

    @Column({name: "case_id"})
    caseId: number;

    @Column({name: "user_id"})
    userId: number;

    @Column()
    title: string;

    @Column({type: "text", nullable: true})
    description: string;

    @Column({type: "datetime", name: "start_time"})
    startTime: Date;

    @Column({type: "datetime", name: "end_time"})
    endTime: Date;

    @Column({name: "location", nullable: true})
    location: string;

    @Column({type: "enum", enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED})
    status: AppointmentStatus;

    @Column({name: "created_at"})
    createdAt: Date;

    @Column({name: "updated_at"})
    updatedAt: Date;

    @ManyToOne(() => Case, (caseEntity) => caseEntity.appointments)
    @JoinColumn({ name: 'case_id' })
    case: Case

    @ManyToOne(() => User, (user) => user.appointments)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
