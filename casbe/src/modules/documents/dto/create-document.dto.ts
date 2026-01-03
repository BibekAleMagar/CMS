import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDocumentDto {

    @IsNumber()
    @IsNotEmpty()
    caseId: number;

    @IsString()
    @IsOptional()
    description?: string;
    
}
