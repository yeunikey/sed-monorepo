import { IsNotEmpty, IsString } from '@nestjs/class-validator'

export class CreateDataDto {

    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    answer: string;

}