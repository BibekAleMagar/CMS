import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('case_documents')
export class Document {

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

    
}
