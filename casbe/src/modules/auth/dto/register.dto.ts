import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class RegisterDto {

    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({example: "your password"})
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;


    @ApiProperty({example: "John"})
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({example: "Cena"})
    @IsString()
    @IsNotEmpty()
    lastName: string;   

    @ApiProperty({example: "Client"})
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;

    @ApiProperty({example: "98********"})
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

}

