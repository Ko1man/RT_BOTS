import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLessonDto {
    @IsNumber()
    @IsNotEmpty()
    number: number;

    @IsNumber()
    @IsNotEmpty()
    shift: number;
}
