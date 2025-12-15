import { Case } from 'src/modules/case/entities/case.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'case_id', nullable: true })
  caseId: number;

  @Column()
  action: string;

  @Column('text')
  description: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.activityLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Case, (caseEntity) => caseEntity.activityLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  case: Case;
}