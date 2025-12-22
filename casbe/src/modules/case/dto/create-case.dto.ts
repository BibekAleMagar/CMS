import { CaseStatus } from "src/common/enums/case-status.enum";
import { IsString,IsNotEmpty, IsNumber, IsOptional, IsDateString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCaseDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "Title of your document"})
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: "short description"})
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example: "lawyerID"})
    lawyerId: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example: "clientId"})
    clientId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({example: "court name"})
    court?: string;

    @IsString()
    @IsOptional()
    filingDate?: Date;

    @IsDateString()
    @IsOptional()
    nextHearingDate: Date;
}
