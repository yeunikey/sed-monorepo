import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    password: string
}
