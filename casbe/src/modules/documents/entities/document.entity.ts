import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Case } from "src/modules/case/entities/case.entity";

@Entity('case_documents')
export class CaseDocument {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'case_id'})
    caseId: number;

    @Column({name: 'file_name'})
    fileName: string;

    @Column({name: 'file_path'})
    filePath: string;

    @Column({name: 'uploaded_by'})
    uploadedBy: number;

    @Column({name: "public_id"})
    publicId: string;

    @Column({name: "file_type"})
    fileType: string;

    @Column({name: "file_size"})
    fileSize: number;

    @Column({type: "text" , nullable: true})
    description: string;

    @Column({name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

      @ManyToOne(() => Case, (caseEntity) => caseEntity.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'case_id' })   
  case: Case;

    @ManyToOne(() => User, (user) => user.documents)
    @JoinColumn({name: 'uploaded_by'})
    uploader: User;
    
}
