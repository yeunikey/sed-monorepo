import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    password: string
}