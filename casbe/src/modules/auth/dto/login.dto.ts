import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginDto  {
    @ApiProperty({example: "superdmin@xyz.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @ApiProperty({example: "yourpassword"})
    @IsString()
    @IsNotEmpty()
    password: string;
}